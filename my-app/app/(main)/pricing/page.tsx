import { Shield, CreditCard, CheckCircle2, Mail } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

export default async function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-14 px-4">
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
          <Badge className="mb-5 bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5">
            Affordable Healthcare
          </Badge>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 mb-5">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Choose the perfect plan for your healthcare needs — no hidden fees, no long-term commitments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ── Trust Badges ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: "HIPAA Compliant", desc: "Your health data is fully secured", color: "text-blue-500" },
            { icon: CheckCircle2, title: "No Hidden Fees", desc: "Transparent pricing always", color: "text-emerald-500" },
            { icon: CreditCard, title: "Cancel Anytime", desc: "No long-term commitments", color: "text-indigo-500" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">{title}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pricing Table ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Choose Your Plan
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Flexible options to meet your healthcare needs
            </p>
          </div>
          <PricingTable />
        </div>

        {/* ── FAQ / Support Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="relative">
            <Shield className="w-10 h-10 text-white mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-bold text-white mb-2">Questions? We&apos;re here to help</h3>
            <p className="text-blue-200 mb-4">
              Contact our support team — we&apos;ll get back to you within 24 hours.
            </p>
            <a
              href="mailto:abhisheksingh159084@gmail.com"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}