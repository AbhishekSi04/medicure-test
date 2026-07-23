/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Calendar } from "lucide-react";
import AppointmentCard from "@/components/appointment-card";

interface AppointmentSettingsProps {
  appointments: any[];
}

export default function DoctorAppointmentsList({ appointments }: AppointmentSettingsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Appointments</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={() => window.location.reload()}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
              No upcoming appointments
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              You don&apos;t have any scheduled appointments yet. Make sure you&apos;ve set your availability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
