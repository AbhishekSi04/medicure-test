import { getPatientAppointments } from "@/actions/patient";
import AppointmentCard from "@/components/appointment-card";
import { Calendar, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  if (appointments?.length == undefined) return;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-0.5">Patient Portal</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Appointments
            </h1>
          </div>
          {appointments.length > 0 && (
            <Badge className="ml-auto bg-white/15 border border-white/25 text-white text-sm font-semibold px-3 py-1.5">
              {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-red-500 dark:text-red-400 font-medium">Error: {error}</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="PATIENT"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No appointments yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              You don&apos;t have any appointments scheduled yet. Browse our doctors and book your first consultation.
            </p>
            <Link href="/doctors">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-500/20 gap-2 px-6">
                Browse Doctors
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}