/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDoctorById, getAvailableTimeSlots } from "@/actions/appointments";
import  DoctorProfile  from "./_components/doctor-profile";
import { redirect } from "next/navigation";

export default async function DoctorProfilePage({ params }:any) {
  const { id } = await params;

  try {
    // Fetch doctor data and available slots in parallel
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
    ]);

    return (
      <DoctorProfile
        doctor={doctorData.doctor}
        availableDays={slotsData.days || []}
      />
    );
  } catch (error:any) {
    console.error("Error loading doctor profile:", error);
    redirect("/doctors");
  }
}