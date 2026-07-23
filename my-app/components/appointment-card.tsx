/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Video, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { completeAppointment, cancelAppointment } from "@/actions/appointments"
import { generateVideoSession, deleteVideoSession } from "@/actions/video-session"
import { toast } from "sonner"
import { useState } from "react"
import { VideoCallModal } from "./video-call-modal"

interface AppointmentCardProps {
  appointment: {
    id: string
    startTime: Date
    endTime: Date
    status: string
    notes?: string | null
    patientDescription?: string | null
    videoSessionId?: string | null
    doctor?: {
      name: string | null
      id: string
      specialty: string | null
    } | null
  }
  userRole: "DOCTOR" | "PATIENT"
  refetchAppointments?: () => void
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
  },
}

export default function AppointmentCard({ appointment, userRole, refetchAppointments }: AppointmentCardProps) {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isGeneratingSession, setIsGeneratingSession] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const statusConfig = STATUS_CONFIG[appointment.status] ?? {
    label: appointment.status,
    className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  }

  const handleComplete = async () => {
    try {
      setIsCompleting(true)
      await completeAppointment(appointment.id)
      await deleteVideoSession(appointment.id)
      toast.success("Appointment marked as completed")
      refetchAppointments?.()
    } catch (error: any) {
      toast.error("Failed to complete appointment", error.message)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      await cancelAppointment(appointment.id)
      toast.success("Appointment cancelled")
      refetchAppointments?.()
    } catch (error: any) {
      toast.error("Failed to cancel appointment", error.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleGenerateVideoSession = async () => {
    try {
      setIsGeneratingSession(true)
      await generateVideoSession(appointment.id)
      toast.success("Video session generated")
      refetchAppointments?.()
    } catch (error: any) {
      toast.error("Failed to generate video session", error.message)
    } finally {
      setIsGeneratingSession(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/60 transition-all duration-200 overflow-hidden">
      {/* Top status bar */}
      <div className={`h-1 w-full ${
        appointment.status === "SCHEDULED" ? "bg-gradient-to-r from-blue-500 to-indigo-600" :
        appointment.status === "COMPLETED" ? "bg-gradient-to-r from-emerald-500 to-teal-600" :
        "bg-gradient-to-r from-red-500 to-rose-600"
      }`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              appointment.status === "SCHEDULED" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
              appointment.status === "COMPLETED" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
              "bg-gradient-to-br from-red-500 to-rose-600"
            }`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">
                {userRole === "PATIENT"
                  ? appointment.doctor?.name || "Unknown Doctor"
                  : "Patient"}
              </p>
              {appointment.doctor?.specialty && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {appointment.doctor.specialty}
                </p>
              )}
            </div>
          </div>

          <Badge className={`text-xs font-semibold flex-shrink-0 ${statusConfig.className}`}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Date & Time */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
            {format(new Date(appointment.startTime), "MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            {format(new Date(appointment.startTime), "h:mm a")} – {format(new Date(appointment.endTime), "h:mm a")}
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="mb-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Doctor Notes</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{appointment.notes}</p>
          </div>
        )}

        {appointment.patientDescription && (
          <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Patient Description</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{appointment.patientDescription}</p>
          </div>
        )}

        {/* Video session indicator */}
        {appointment.videoSessionId && appointment.status === "SCHEDULED" && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            <Video className="h-4 w-4" />
            Video session ready
          </div>
        )}

        {/* Action Buttons */}
        {appointment.status === "SCHEDULED" && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {userRole === "DOCTOR" && (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex-1 min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl gap-2 text-sm"
              >
                {isCompleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {isCompleting ? "Completing..." : "Complete"}
              </Button>
            )}

            <Button
              onClick={handleCancel}
              disabled={isCancelling}
              className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white rounded-xl gap-2 text-sm"
            >
              {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              {isCancelling ? "Cancelling..." : "Cancel"}
            </Button>

            {userRole === "DOCTOR" && !appointment.videoSessionId && (
              <Button
                onClick={handleGenerateVideoSession}
                disabled={isGeneratingSession}
                className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 text-sm shadow-md shadow-blue-500/20"
              >
                {isGeneratingSession ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                {isGeneratingSession ? "Generating..." : "Generate Video"}
              </Button>
            )}

            {appointment.videoSessionId && (
              <Button
                onClick={() => setIsVideoCallOpen(true)}
                className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 text-sm shadow-md shadow-blue-500/20"
              >
                <Video className="h-4 w-4" />
                Start Video Call
              </Button>
            )}
          </div>
        )}
      </div>

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        appointmentId={appointment.id}
        userRole={userRole}
        videoSessionId={appointment.videoSessionId}
      />
    </div>
  )
}
