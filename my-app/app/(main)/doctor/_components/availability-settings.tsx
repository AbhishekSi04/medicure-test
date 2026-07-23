/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Loader2, AlertCircle, CheckCircle2, X, Save } from "lucide-react";
import { format } from "date-fns";
import { setAvailabilitySlots } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

interface AvailabilitySettingsProps {
  slots: any[];
}

export function AvailabilitySettings({ slots }: AvailabilitySettingsProps) {
  const [showForm, setShowForm] = useState(false);
  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { startTime: "", endTime: "" },
  });

  function createLocalDateFromTime(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  }

  const onSubmit = async (data: any) => {
    if (loading) return;
    const formData = new FormData();
    const startDate = createLocalDateFromTime(data.startTime);
    const endDate = createLocalDateFromTime(data.endTime);
    if (startDate >= endDate) { toast.error("End time must be after start time"); return; }
    formData.append("startTime", startDate.toISOString());
    formData.append("endTime", endDate.toISOString());
    await submitSlots(formData);
  };

  useEffect(() => {
    if (data && data?.success) { setShowForm(false); toast.success("Availability slots updated successfully"); }
  }, [data]);

  const formatTimeString = (dateString: string) => {
    try { return format(new Date(dateString), "h:mm a"); }
    catch (e: any) { return e.message || "Invalid time"; }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Availability Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set your daily availability for patient appointments</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {!showForm ? (
          <>
            {/* Current slots */}
            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-blue-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs">
                  You haven&apos;t set any availability slots yet. Add your hours to start accepting appointments.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Current Availability</h3>
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {formatTimeString(slot.startTime)} – {formatTimeString(slot.endTime)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{slot.appointment ? "Booked" : "Available"}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${slot.appointment ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}`}>
                      {slot.appointment ? "Booked" : "Free"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              Set Availability Time
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Set Daily Availability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startTime" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</Label>
                <Input id="startTime" type="time" className="rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  {...register("startTime", { required: "Start time is required" })}
                />
                {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime" className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time</Label>
                <Input id="endTime" type="time" className="rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  {...register("endTime", { required: "End time is required" })}
                />
                {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading} className="rounded-xl border-slate-200 dark:border-slate-700 gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Availability</>}
              </Button>
            </div>
          </form>
        )}

        {/* Info banner */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-0.5">How Availability Works</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/70">
                Setting your daily availability allows patients to book during those hours. The same schedule applies to all days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}