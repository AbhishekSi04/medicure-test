import { ClipboardCheck, AlertCircle, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
  const user = await getCurrentUser();

  if (user?.verificationStatus === "VERIFIED") redirect("/doctor");

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

          {/* Gradient header */}
          <div className={`relative overflow-hidden py-10 px-6 text-center ${isRejected ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-blue-600 to-indigo-700"}`}>
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
            />
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${isRejected ? "bg-white/15" : "bg-white/15"} border border-white/20`}>
                {isRejected
                  ? <XCircle className="h-8 w-8 text-white" />
                  : <ClipboardCheck className="h-8 w-8 text-white" />
                }
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {isRejected ? "Verification Declined" : "Verification in Progress"}
              </h1>
              <p className="text-white/80 text-base">
                {isRejected
                  ? "Unfortunately, your application needs revision"
                  : "Thank you for submitting your information"}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {isRejected ? (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                    <p className="leading-relaxed">
                      Our administrative team reviewed your application and found it doesn&apos;t meet current requirements. Common reasons include:
                    </p>
                    <ul className="space-y-1.5 pl-2">
                      {[
                        "Insufficient or unclear credential documentation",
                        "Professional experience requirements not met",
                        "Incomplete or vague service description",
                        "Missing required certifications or licenses",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      You can update your profile and resubmit for review.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
                    <p className="leading-relaxed">
                      Your profile is currently under review. This typically takes <strong>1–2 business days</strong>. You&apos;ll receive an email once verified.
                    </p>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 space-y-2">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">What happens next?</p>
                      {[
                        "We verify your medical credentials and licenses",
                        "Review your professional experience",
                        "Confirm your availability and service areas",
                        "Set up your payment preferences",
                      ].map((step) => (
                        <div key={step} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-slate-600 dark:text-slate-400 text-sm text-center leading-relaxed">
              {isRejected
                ? "Update your doctor profile and resubmit for verification. Our team is available to help."
                : "While you wait, feel free to reach out to our support team if you have any questions."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700">
                <Link href="/">Return to Home</Link>
              </Button>
              {isRejected && (
                <Button asChild className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white gap-2 shadow-md shadow-blue-500/20">
                  <Link href="/doctor/update-profile">
                    Update Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}