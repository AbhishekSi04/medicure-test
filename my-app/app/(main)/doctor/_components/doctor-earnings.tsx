/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getDoctorEarnings, getDoctorPayouts, requestPayout } from "@/actions/payouts";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { DollarSign, TrendingUp, Calendar, CreditCard, Loader2, ArrowDownToLine, ClipboardList } from "lucide-react";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function PayoutForm({ availableCredits, onSuccess }: { availableCredits: number; onSuccess: () => void }) {
  const [clientError, setClientError] = useState<string | null>(null);
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    setClientError(null);
    const email = formData.get("paypalEmail") as string;
    if (!email) { setClientError("PayPal email is required."); return {}; }
    if (!validateEmail(email)) { setClientError("Please enter a valid PayPal email address."); return {}; }
    if (availableCredits < 1) { setClientError("You need at least 1 available credit to request a payout."); return {}; }
    try {
      const result = await requestPayout(formData);
      onSuccess();
      return { success: true, message: "Payout requested successfully!", result };
    } catch (err: any) {
      setClientError(err.message);
      return { error: err.message };
    }
  }, {});

  return (
    <form action={formAction} className="flex flex-col sm:flex-row items-start gap-3">
      <input
        type="email"
        name="paypalEmail"
        placeholder="your@paypal.com"
        className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
        required
      />
      <Button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20 flex-shrink-0"
      >
        {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Requesting...</> : <><ArrowDownToLine className="h-4 w-4" /> Request Payout</>}
      </Button>
      <div className="w-full sm:hidden">
        {clientError && <p className="text-red-500 text-xs mt-1">{clientError}</p>}
        {state?.success && <p className="text-emerald-600 text-xs mt-1">{state.message}</p>}
      </div>
    </form>
  );
}

export default function DoctorEarnings() {
  const [earnings, setEarnings] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchData = async () => {
    try {
      const { earnings } = await getDoctorEarnings();
      const { payouts } = await getDoctorPayouts();
      setEarnings(earnings);
      setPayouts(payouts);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading earnings...</p>
      </div>
    </div>
  );

  if (fetchError) return (
    <div className="p-6 text-center text-red-500 dark:text-red-400 text-sm">{fetchError}</div>
  );

  if (!earnings) return (
    <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">No earnings data found.</div>
  );

  const statCards = [
    { icon: DollarSign, label: "Total Earnings", value: `$${earnings.totalEarnings}`, color: "from-blue-500 to-indigo-600" },
    { icon: TrendingUp, label: "This Month", value: `$${earnings.thisMonthEarnings}`, color: "from-emerald-500 to-teal-600" },
    { icon: Calendar, label: "Appointments Done", value: earnings.completedAppointments, color: "from-violet-500 to-purple-600" },
    { icon: TrendingUp, label: "Avg / Month", value: `$${earnings.averageEarningsPerMonth.toFixed(2)}`, color: "from-amber-500 to-orange-500" },
    { icon: CreditCard, label: "Available Credits", value: earnings.availableCredits, color: "from-blue-500 to-cyan-500" },
    { icon: ArrowDownToLine, label: "Available for Payout", value: `$${earnings.availablePayout}`, color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Earnings Overview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track your earnings, credits, and payout history</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payout request */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ArrowDownToLine className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Request Payout</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Withdraw to your PayPal — minimum 1 credit required</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <PayoutForm availableCredits={earnings.availableCredits} onSuccess={fetchData} />
        </div>
      </div>

      {/* Payout history */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payout History</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          {payouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardList className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No payouts yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{p.credits}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">${p.netAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "PROCESSED" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
