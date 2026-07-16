"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Medal, FileText, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { updateDoctorStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

type Doctor = {
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

type VerifiedDoctorsProps = {
  doctors: Doctor[];
};

export function VerifiedDoctors({ doctors }: VerifiedDoctorsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { loading, data, fn: submitStatusUpdate } = useFetch(updateDoctorStatus);

  const handleViewDetails = (doctor: Doctor) => setSelectedDoctor(doctor);
  const handleCloseDialog = () => setSelectedDoctor(null);

  const handleRejectDoctor = async (doctorId: string) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", "REJECTED");
    await submitStatusUpdate(formData);
    toast.success("Status Updated!");
    setSelectedDoctor(null);
  };

  useEffect(() => {
    if (data?.success) handleCloseDialog();
  }, [data]);

  return (
    <div>
      {/* ── Section Card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Verified Doctors
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage verified doctor accounts
            </p>
          </div>
          {doctors.length > 0 && (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              {doctors.length} doctors
            </Badge>
          )}
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-blue-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No verified doctors yet
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                Approved doctors will appear here.
              </p>
            </div>
          ) : (
            doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">
                      {doctor.name || "Unnamed Doctor"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {doctor.specialty || "No specialty"} &bull;{" "}
                      {doctor.experience || 0} yrs exp
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(doctor)}
                    className="text-xs border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Doctor Details Dialog ── */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 overflow-hidden">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  Verified Doctor Details
                </DialogTitle>
                <DialogDescription className="text-emerald-100 text-sm mt-0.5">
                  View doctor information and manage account status
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Full Name", value: selectedDoctor.name || "Unnamed Doctor" },
                  { label: "Email", value: selectedDoctor.email },
                  {
                    label: "Verified On",
                    value: format(new Date(selectedDoctor.createdAt), "PPP"),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Professional Info */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Medal className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Professional Details
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Specialty</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {selectedDoctor.specialty || "No specialty"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Experience</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {selectedDoctor.experience || 0} years
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Credentials
                    </p>
                    <a
                      href={selectedDoctor.credentialUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                    >
                      View Credential Document
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Service Description
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {selectedDoctor.description || "No description provided"}
                </p>
              </div>
            </div>

            <DialogFooter className="flex px-6 pb-6 pt-2">
              <Button
                variant="destructive"
                onClick={() => handleRejectDoctor(selectedDoctor.id)}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 rounded-xl gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                {loading ? "Processing..." : "Revoke Verification"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
