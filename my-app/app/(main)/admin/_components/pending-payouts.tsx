/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { approvePayout } from "@/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DollarSign, User, Clock, CreditCard, TrendingDown, CheckCircle2, Loader2 } from "lucide-react";

export type PayoutWithDoctor = {
  id: string;
  amount: number;
  credits: number;
  platformFee: number;
  netAmount: number;
  paypalEmail: string;
  status: "PROCESSING" | "PROCESSED";
  createdAt: string;
  processedAt: string | null;
  processedBy: string | null;
  doctor: {
    id: string;
    name: string | null;
    email: string;
    specialty: string | null;
    experience: number | null;
    description: string | null;
    credentialUrl: string | null;
    createdAt: string;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | null;
    role: "PATIENT" | "DOCTOR" | "ADMIN";
  };
};

type PendingPayoutsProps = {
  payouts: PayoutWithDoctor[];
};

export function PendingPayouts({ payouts }: PendingPayoutsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (payoutId: string) => {
    setLoadingId(payoutId);
    try {
      await approvePayout(payoutId);
      toast.success("Payout approved!");
    } catch (err: unknown) {
      let message = "Failed to approve payout";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as any).message === "string"
      ) {
        message = (err as { message: string }).message;
      }
      toast.error(message);
    } finally {
      setLoadingId(null);
      router.refresh();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Pending Payouts
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review and approve doctor payout requests
          </p>
        </div>
        {payouts.length > 0 && (
          <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
            {payouts.length} pending
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              All clear!
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              No pending payouts at this time.
            </p>
          </div>
        ) : (
          payouts.map((payout) => (
            <div
              key={payout.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-slate-800 transition-all overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">

                {/* ── Doctor Info ── */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white text-sm truncate">
                        {payout.doctor.name || "Unnamed Doctor"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {payout.doctor.specialty || "No specialty"} &bull;{" "}
                        {payout.doctor.experience || 0} yrs
                      </p>
                    </div>
                    <Badge className="ml-auto bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <User className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{payout.doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{payout.paypalEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Requested {format(new Date(payout.createdAt), "PPP")}</span>
                    </div>
                  </div>
                </div>

                {/* ── Payout Details + Action ── */}
                <div className="p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    {/* Credits */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Credits Earned</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{payout.credits}</span>
                    </div>

                    {/* Net Amount */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-emerald-500 rotate-180" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Net Payout</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${payout.netAmount}</span>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Platform Fee</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">${payout.platformFee}</span>
                    </div>
                  </div>

                  {/* Approve Button */}
                  <Button
                    disabled={loadingId === payout.id}
                    onClick={() => handleApprove(payout.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all gap-2"
                  >
                    {loadingId === payout.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Payout
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
