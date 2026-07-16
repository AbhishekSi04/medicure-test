/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PendingDoctors } from "./_components/pending-doctors";
import { VerifiedDoctors } from "./_components/verified-doctors";
import {
  getPendingDoctors,
  getVerifiedDoctors,
  AdminResponse,
  getPendingPayouts,
} from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { PendingPayouts } from "./_components/pending-payouts";

export default function AdminPage() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    loading: pendingLoading,
    data: pendingData,
    error: pendingError,
    fn: fetchPendingDoctors,
  } = useFetch<AdminResponse>(getPendingDoctors);

  const {
    loading: verifiedLoading,
    data: verifiedData,
    error: verifiedError,
    fn: fetchVerifiedDoctors,
  } = useFetch<AdminResponse>(getVerifiedDoctors);

  const {
    loading: payoutLoading,
    data: payoutData,
    error: payoutError,
    fn: fetchPendingPayouts,
  } = useFetch<AdminResponse>(getPendingPayouts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchPendingDoctors(new FormData());
        fetchVerifiedDoctors(new FormData());
        fetchPendingPayouts(new FormData());
      } catch (error: any) {
        toast.error("Failed to fetch doctors data", error.message);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (pendingError) toast.error(pendingError.message);
    if (verifiedError) toast.error(verifiedError.message);
    if (payoutError) toast.error(payoutError.message);
  }, [pendingError, verifiedError, payoutError]);

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      <BarLoader width="100%" color="#3b82f6" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <TabsContent value="pending" className="mt-0">
        {isInitialLoad || pendingLoading ? (
          <LoadingSkeleton />
        ) : (
          <PendingDoctors doctors={pendingData?.doctors || []} />
        )}
      </TabsContent>

      <TabsContent value="verified" className="mt-0">
        {isInitialLoad || verifiedLoading ? (
          <LoadingSkeleton />
        ) : (
          <VerifiedDoctors doctors={verifiedData?.doctors || []} />
        )}
      </TabsContent>

      <TabsContent value="payouts" className="mt-0">
        {isInitialLoad || payoutLoading ? (
          <LoadingSkeleton />
        ) : (
          <PendingPayouts payouts={payoutData?.payouts || []} />
        )}
      </TabsContent>
    </div>
  );
}
