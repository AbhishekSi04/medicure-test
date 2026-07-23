/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createAppointment } from "@/actions/appointments"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock, Stethoscope, User, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const bookingFormSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description of your symptoms"),
  notes: z.string().optional(),
})

interface DoctorProfileProps {
  doctor: {
    id: string
    name: string | null
    specialty: string | null
    experience: number | null
    image?: string | null
  }
  availableDays: {
    date: string
    displayDate: string
    slots: {
      startTime: string
      endTime: string
      formatted: string
    }[]
  }[]
}

export default function DoctorProfile({ doctor, availableDays }: DoctorProfileProps) {
  const router = useRouter()
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { description: "", notes: "" },
  })

  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    if (!selectedSlot) return
    try {
      setIsSubmitting(true)
      const result = await createAppointment({
        doctorId: doctor.id,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        description: values.description,
        notes: values.notes,
      })
      if (result.appointment) {
        toast.success("Appointment booked successfully!")
        setIsDialogOpen(false)
        router.refresh()
        router.push("/appointments")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment")
    } finally {
      setIsSubmitting(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="relative max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-0.5">Doctor Profile & Booking</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {doctor.name || "Doctor"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* ── Doctor Info Panel ── */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20 mb-4">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name || "Doctor"} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {doctor.name || "Doctor"}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1.5 mb-3">
                <Stethoscope className="w-4 h-4" />
                {doctor.specialty || "General Practitioner"}
              </p>

              <div className="w-full space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{doctor.experience || 0} years experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Verified Doctor</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Booking Slots Panel ── */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Available Time Slots</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Select a slot to book your appointment</p>
              </div>

              <div className="p-6 space-y-6">
                {availableDays.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No available slots</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">This doctor has no upcoming availability. Please check back later.</p>
                  </div>
                ) : (
                  availableDays.map((day) => (
                    <div key={day.date}>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {day.displayDate}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {day.slots.map((slot) => (
                          <Dialog key={slot.startTime} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full rounded-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 text-sm font-medium transition-colors"
                                onClick={() => { setSelectedSlot(slot); form.reset() }}
                              >
                                {slot.formatted}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800 p-0 overflow-hidden">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold text-white">Book Appointment</DialogTitle>
                                  <p className="text-blue-200 text-sm">with {doctor.name} · {slot.formatted}</p>
                                </DialogHeader>
                              </div>
                              <div className="p-6">
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="description"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description of Symptoms</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              placeholder="Please describe your symptoms in detail..."
                                              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="notes"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Additional Notes (Optional)</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              placeholder="Any additional information you'd like to share..."
                                              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20"
                                    >
                                      {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</>
                                      ) : (
                                        <><CheckCircle2 className="h-4 w-4" /> Confirm Booking</>
                                      )}
                                    </Button>
                                  </form>
                                </Form>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
