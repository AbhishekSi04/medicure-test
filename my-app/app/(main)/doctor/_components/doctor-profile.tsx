/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Stethoscope,
  Briefcase,
  FileText,
  Link as LinkIcon,
  Loader2,
  CheckCircle2,
  Pencil,
  Shield,
  X,
  Save,
} from "lucide-react";
import { updateDoctorProfile } from "@/actions/doctor";
import { SPECIALTIES } from "@/lib/specialities";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

interface DoctorProfileProps {
  user: any;
}

export default function DoctorProfile({ user }: DoctorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { loading, fn: submitUpdate, data } = useFetch(updateDoctorProfile);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: {
      specialty: user?.specialty || "",
      experience: user?.experience || "",
      description: user?.description || "",
      credentialUrl: user?.credentialUrl || "",
    },
  });

  const specialtyValue = watch("specialty");

  useEffect(() => {
    if (data && (data as any)?.success) {
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  }, [data]);

  const onSubmit = async (formValues: any) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("specialty", formValues.specialty);
    formData.append("experience", formValues.experience.toString());
    formData.append("description", formValues.description);
    formData.append("credentialUrl", formValues.credentialUrl);
    await submitUpdate(formData);
  };

  const handleCancel = () => {
    reset({ specialty: user?.specialty || "", experience: user?.experience || "", description: user?.description || "", credentialUrl: user?.credentialUrl || "" });
    setIsEditing(false);
  };

  const InfoTile = ({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  );

  // ── Read-only view ──
  if (!isEditing) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your professional information visible to patients</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="p-6 space-y-5">
          {/* Profile hero */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{user?.name || "Doctor"}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email || "N/A"}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </Badge>
                {user?.specialty && (
                  <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs">
                    {user.specialty}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Info tiles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoTile icon={Stethoscope} label="Specialty">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.specialty || "Not set"}</p>
            </InfoTile>
            <InfoTile icon={Briefcase} label="Experience">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.experience ? `${user.experience} years` : "Not set"}</p>
            </InfoTile>
            <InfoTile icon={Mail} label="Email">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.email || "Not available"}</p>
            </InfoTile>
            <InfoTile icon={Shield} label="Verification Status">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{user?.verificationStatus || "N/A"}</p>
            </InfoTile>
          </div>

          <InfoTile icon={FileText} label="Description">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              {user?.description || "No description provided yet."}
            </p>
          </InfoTile>

          <InfoTile icon={LinkIcon} label="Credential Document">
            {user?.credentialUrl ? (
              <a href={user.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
                {user.credentialUrl}
              </a>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">No credential URL provided.</p>
            )}
          </InfoTile>
        </div>
      </div>
    );
  }

  // ── Edit form ──
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Pencil className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your professional information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Specialty */}
        <div className="space-y-1.5">
          <Label htmlFor="specialty" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> Medical Specialty
          </Label>
          <Select value={specialtyValue} onValueChange={(value) => setValue("specialty", value)}>
            <SelectTrigger id="specialty" className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((spec) => (
                <SelectItem key={spec.name} value={spec.name} className="flex items-center gap-2">
                  <span className="text-blue-500">{spec.icon}</span> {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.specialty && <p className="text-xs text-red-500">{errors.specialty.message as string}</p>}
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <Label htmlFor="experience" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-blue-500" /> Years of Experience
          </Label>
          <Input id="experience" type="number" placeholder="e.g. 5" className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            {...register("experience", { required: "Experience is required", valueAsNumber: true, min: { value: 1, message: "Must be at least 1 year" }, max: { value: 70, message: "Must be less than 70 years" } })}
          />
          {errors.experience && <p className="text-xs text-red-500">{errors.experience.message as string}</p>}
        </div>

        {/* Credential URL */}
        <div className="space-y-1.5">
          <Label htmlFor="credentialUrl" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5 text-blue-500" /> Credential Document URL
          </Label>
          <Input id="credentialUrl" type="url" placeholder="https://example.com/my-medical-degree.pdf" className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            {...register("credentialUrl", { required: "Credential URL is required" })}
          />
          {errors.credentialUrl && <p className="text-xs text-red-500">{errors.credentialUrl.message as string}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-blue-500" /> Description of Your Services
          </Label>
          <Textarea id="description" rows={4} placeholder="Describe your expertise, services, and approach..." className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 resize-none"
            {...register("description", { required: "Description is required", minLength: { value: 20, message: "Minimum 20 characters" }, maxLength: { value: 1000, message: "Maximum 1000 characters" } })}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message as string}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading} className="rounded-xl border-slate-200 dark:border-slate-700 gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl gap-2 shadow-md shadow-blue-500/20">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
