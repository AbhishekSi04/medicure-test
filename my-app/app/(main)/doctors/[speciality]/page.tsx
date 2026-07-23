/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import { DoctorCard } from "../_components/doctor-card";
import { Stethoscope, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DoctorSpecialtyPage({ params }: { params: { speciality: string } }) {
  const { speciality } = await params;

  if (!speciality) redirect("/doctors");

  const { doctors, error } = await getDoctorsBySpecialty(speciality);

  if (error) console.error("Error fetching doctors:", error);

  const displayName = speciality.split("%20").join(" ");

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
        <div className="relative max-w-7xl mx-auto">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Specialties
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-200 text-sm font-medium mb-0.5">Browse Specialists</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {displayName}
              </h1>
            </div>
            {doctors && doctors.length > 0 && (
              <span className="ml-auto bg-white/15 border border-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Doctors Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {doctors && doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {doctors.map((doctor: any) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6">
              <Stethoscope className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No doctors available
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              There are currently no verified doctors in this specialty. Please check back later or choose another specialty.
            </p>
            <Link href="/doctors" className="mt-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium">
              <ArrowLeft className="w-4 h-4" />
              Browse other specialties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}