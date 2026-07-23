"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Loader2, ArrowLeft, CheckCircle2, Link as LinkIcon, FileText, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setUserRole } from "@/actions/onboarding";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import z from "zod";

const doctorFormSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),
  experience: z
    .number({ invalid_type_error: "Experience must be a number" })
    .int()
    .min(1, "Experience must be at least 1 year")
    .max(70, "Experience must be less than 70 years"),
  credentialUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});

type DoctorFormData = z.infer<typeof doctorFormSchema>;

export default function OnboardingPage() {
  const [step, setStep] = useState<"choose-role" | "doctor-form">("choose-role");
  const router = useRouter();
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: { specialty: "", experience: undefined, credentialUrl: "", description: "" },
  });

  const specialtyValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data?.success) router.push(data.redirect);
  }, [data, router]);

  const onDoctorSubmit = async (formData: DoctorFormData) => {
    if (loading) return;
    const data = new FormData();
    data.append("role", "DOCTOR");
    data.append("specialty", formData.specialty);
    data.append("experience", formData.experience.toString());
    data.append("credentialUrl", formData.credentialUrl);
    data.append("description", formData.description);
    await submitUserRole(data);
  };

  // ── Role Selection ──
  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Patient Card */}
        <button
          className="group text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => !loading && handlePatientSelection()}
          disabled={loading}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
            <User className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Join as a Patient
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
            Book appointments, consult with doctors, and manage your healthcare journey with ease.
          </p>
          <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Continue as Patient</>
            )}
          </div>
        </button>

        {/* Doctor Card */}
        <button
          className="group text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => !loading && setStep("doctor-form")}
          disabled={loading}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Join as a Doctor
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
            Create your professional profile, set your availability, and start providing consultations.
          </p>
          <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition-all">
            <Stethoscope className="h-4 w-4" />
            Continue as Doctor
          </div>
        </button>
      </div>
    );
  }

  // ── Doctor Form ──
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Complete Your Doctor Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Please provide your professional details for verification
        </p>
      </div>

      <form onSubmit={handleSubmit(onDoctorSubmit)} className="p-6 space-y-5">
        {/* Specialty */}
        <div className="space-y-1.5">
          <Label htmlFor="specialty" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Award className="h-4 w-4 text-blue-500" />
            Medical Specialty
          </Label>
          <Select value={specialtyValue} onValueChange={(value) => setValue("specialty", value)}>
            <SelectTrigger id="specialty" className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((spec) => (
                <SelectItem key={spec.name} value={spec.name} className="flex items-center gap-2">
                  <span className="text-blue-500">{spec.icon}</span>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty.message}</p>}
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <Label htmlFor="experience" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            Years of Experience
          </Label>
          <Input
            id="experience"
            type="number"
            placeholder="e.g. 5"
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            {...register("experience", { valueAsNumber: true })}
          />
          {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
        </div>

        {/* Credential URL */}
        <div className="space-y-1.5">
          <Label htmlFor="credentialUrl" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            Link to Credential Document
          </Label>
          <Input
            id="credentialUrl"
            type="url"
            placeholder="https://example.com/my-medical-degree.pdf"
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            {...register("credentialUrl")}
          />
          {errors.credentialUrl && <p className="text-xs text-red-500 mt-1">{errors.credentialUrl.message}</p>}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please provide a link to your medical degree or certification
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="h-4 w-4 text-blue-500" />
            Description of Your Services
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your expertise, services, and approach to patient care..."
            rows={4}
            className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-none"
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        {/* Footer buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("choose-role")}
            disabled={loading}
            className="rounded-xl border-slate-200 dark:border-slate-700 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Submit for Verification</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}