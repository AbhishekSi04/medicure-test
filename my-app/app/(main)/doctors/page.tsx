import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";
import { Search } from "lucide-react";

export default async function DoctorsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-4">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 mb-5">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Find Your Doctor
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Browse by specialty or view all available healthcare providers
          </p>
        </div>
      </div>

      {/* ── Specialty Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SPECIALTIES.map((specialty) => (
            <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
              <div className="group flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                  <span className="text-2xl group-hover:grayscale-0 transition-all">{specialty.icon}</span>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {specialty.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}