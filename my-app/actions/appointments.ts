"use server"

import { db } from "@/lib/prisma";
import { addDays, addMinutes, endOfDay, format } from "date-fns";
import { getCurrentUser } from "./onboarding";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { error } from "console";

interface TimeSlot {
  startTime: string;
  endTime: string;
  formatted: string;
  day: string;
}

interface AvailableSlots {
  [key: string]: TimeSlot[];
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId : string) {
    try {
      const doctor = await db.user.findUnique({
        where: {
          id: doctorId,
          role: "DOCTOR",
          verificationStatus: "VERIFIED",
        },
      });
  
      if (!doctor) {
        throw new Error("Doctor not found");
      }
  
      return { doctor };
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
      throw new Error("Failed to fetch doctor details");
    }
  }


  
/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId: string) {
  try {
    // Step 1: Check if doctor exists and is verified
    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Step 2: Get doctor's availability
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    if (!availability) {
      throw new Error("No availability set by doctor");
    }

    // Step 3: Get next 4 days
    const today = new Date();
    const nextFourDays = [
      today,
      addDays(today, 1),
      addDays(today, 2),
      addDays(today, 3)
    ];

    // Step 4: Get existing appointments
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: endOfDay(nextFourDays[3]), // Up to end of 4th day
        },
      },
    });

    // Step 5: Generate available slots for each day
    const availableSlots: AvailableSlots = {};

    for (const day of nextFourDays) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlots[dayString] = [];

      // Get doctor's working hours for this day
      const workStart = new Date(availability.startTime);
      const workEnd = new Date(availability.endTime);

      // Set to current day
      workStart.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
      workEnd.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

      // Generate 30-minute slots
      let currentSlot = new Date(workStart);
      while (currentSlot < workEnd) {
        const nextSlot = addMinutes(currentSlot, 30);

        // Skip past slots
        if (currentSlot < today) {
          currentSlot = nextSlot;
          continue;
        }

        // Check if slot is available
        const isSlotAvailable = !existingAppointments.some(appointment => {
          const apptStart = new Date(appointment.startTime);
          const apptEnd = new Date(appointment.endTime);
          return (
            (currentSlot >= apptStart && currentSlot < apptEnd) ||
            (nextSlot > apptStart && nextSlot <= apptEnd)
          );
        });

        if (isSlotAvailable) {
          availableSlots[dayString].push({
            startTime: currentSlot.toISOString(),
            endTime: nextSlot.toISOString(),
            formatted: `${format(currentSlot, "h:mm a")} - ${format(nextSlot, "h:mm a")}`,
            day: format(currentSlot, "EEEE, MMMM d"),
          });
        }

        currentSlot = nextSlot;
      }
    }

    // Step 6: Format result for UI
    const result = Object.entries(availableSlots).map(([date, slots]) => ({
      date,
      displayDate: slots.length > 0 ? slots[0].day : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error: any) {
    console.error("Error getting available slots:", error);
    throw new Error("Failed to get available time slots: " + error.message);
  }
}



interface CreateAppointmentData {
  doctorId: string;
  startTime: string;
  endTime: string;
  description: string;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentData) {
  try {
    // Step 1: Get current user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!user) {
      throw new Error("Only patients can book appointments");
    }

    // Step 2: Check for minimum credits
    if (user.credits < 2) {
      throw new Error("Not enough credits. Please buy a subscription.");
    }

    // Step 3: Validate doctor exists
    const doctor = await db.user.findUnique({
      where: {
        id: data.doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    // Step 4: Check for overlapping appointments
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        status: "SCHEDULED",
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is no longer available");
    }

    // Step 5: Create the appointment and deduct credits in a transaction
    const appointment = await db.$transaction(async (tx) => {
      const newAppointment = await tx.appointment.create({
        data: {
          patientId: user.id,
          doctorId: data.doctorId,
          startTime: startTime,
          endTime: endTime,
          status: "SCHEDULED",
          patientDescription: data.description,
          notes: data.notes,
        },
        include: {
          doctor: {
            select: {
              name: true,
              email: true,
            },
          },
          patient: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Deduct 2 credits from the user
      await tx.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });
      
      // increment credits in the doctor
      await tx.user.update({
        where: { id: doctor.id },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      return newAppointment;
    });

    revalidatePath("/appointments");
    return { appointment };

  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw new Error(error.message || "Failed to create appointment");
  }
}

/**
 * Complete an appointment
 */
export async function completeAppointment(appointmentId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const doctor = await db.user.findFirst({
      where: {
        id: appointment.doctorId,
        clerkUserId: userId,
      },
    });

    if (!doctor) {
      throw new Error("Only the doctor can complete the appointment");
    }

    const now = new Date();
    if (now < appointment.endTime) {
      throw new Error("You can only complete the appointment after it ends");
    }

    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/appointments");
    return { success: true };
  } catch (error: any) {
    console.error("Error completing appointment:", error);
    throw new Error("Failed to complete appointment: " + error.message);
  }
}


/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const currentUser = await db.user.findFirst({
      where: {
        clerkUserId: userId,
      },
    });

    if (!currentUser) {
      throw new Error("Unauthorized to modify this appointment");
    }

    const isDoctor = currentUser.id === appointment.doctorId;
    const isPatient = currentUser.id === appointment.patientId;

    if (!isDoctor && !isPatient) {
      throw new Error("You are not authorized to cancel this appointment");
    }

    await db.$transaction(async (tx) => {
      // 1. Cancel the appointment
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "CANCELLED" },
      });

      // 2. Update credits
      if (isPatient) {
        await tx.user.update({
          where: { id: currentUser.id },
          data: {
            credits: {
              increment: 2, // refund
            },
          },
        });
      } else if (isDoctor) {
        await tx.user.update({
          where: { id: currentUser.id },
          data: {
            credits: {
              decrement: 2, // penalty
            },
          },
        });
      }
    });

    revalidatePath("/appointments");
    return { success: true };
  } catch (error: any) {
    console.error("Error cancelling appointment:", error);
    throw new Error("Failed to cancel appointment: " + error.message);
  }
}


