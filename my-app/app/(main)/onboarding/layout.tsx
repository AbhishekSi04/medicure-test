/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";

export default async function OnboardingLayout({ children }: any) {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "PATIENT") redirect("/doctors");
    else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "VERIFIED") redirect("/doctor");
      else redirect("/doctor/verification");
    } else if (user.role === "ADMIN") redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Gradient Header ── */}
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

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 mb-5">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Welcome to MediCure
          </h1>
          <p className="text-blue-200 text-lg">
            Tell us how you want to use the platform
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {children}
      </div>
    </div>
  );
}