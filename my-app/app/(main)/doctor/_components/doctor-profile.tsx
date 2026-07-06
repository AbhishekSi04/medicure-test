/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
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
    reset({
      specialty: user?.specialty || "",
      experience: user?.experience || "",
      description: user?.description || "",
      credentialUrl: user?.credentialUrl || "",
    });
    setIsEditing(false);
  };

  // Read-only profile view
  if (!isEditing) {
    return (
      <Card className="border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                My Profile
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-300 mt-1">
                Your professional information visible to patients
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                {user?.name || "Doctor"}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
                {user?.email || "N/A"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/30 text-xs"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                {user?.specialty && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700/30 text-xs"
                  >
                    {user.specialty}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Specialty</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {user?.specialty || "Not set"}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Experience</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {user?.experience ? `${user.experience} years` : "Not set"}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Verification Status</span>
              </div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {user?.verificationStatus || "N/A"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {user?.description || "No description provided yet."}
            </p>
          </div>

          {/* Credential URL */}
          <div className="p-4 bg-zinc-50 dark:bg-slate-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Credential Document</span>
            </div>
            {user?.credentialUrl ? (
              <a
                href={user.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {user.credentialUrl}
              </a>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No credential URL provided.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit profile form
  return (
    <Card className="border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white flex items-center">
          <Pencil className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
          Edit Profile
        </CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-300">
          Update your professional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Specialty */}
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-zinc-700 dark:text-zinc-200">
              Medical Specialty
            </Label>
            <Select
              value={specialtyValue}
              onValueChange={(value) => setValue("specialty", value)}
            >
              <SelectTrigger id="specialty" className="bg-background border-blue-200 dark:border-blue-900/40">
                <SelectValue placeholder="Select your specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((spec) => (
                  <SelectItem
                    key={spec.name}
                    value={spec.name}
                    className="flex items-center gap-2"
                  >
                    <span className="text-blue-400">{spec.icon}</span>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.specialty && (
              <p className="text-sm font-medium text-red-500 mt-1">
                {errors.specialty.message as string}
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-zinc-700 dark:text-zinc-200">
              Years of Experience
            </Label>
            <Input
              id="experience"
              type="number"
              placeholder="e.g. 5"
              className="bg-background border-blue-200 dark:border-blue-900/40 text-zinc-900 dark:text-white"
              {...register("experience", {
                required: "Experience is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1 year" },
                max: { value: 70, message: "Must be less than 70 years" },
              })}
            />
            {errors.experience && (
              <p className="text-sm font-medium text-red-500 mt-1">
                {errors.experience.message as string}
              </p>
            )}
          </div>

          {/* Credential URL */}
          <div className="space-y-2">
            <Label htmlFor="credentialUrl" className="text-zinc-700 dark:text-zinc-200">
              Link to Credential Document
            </Label>
            <Input
              id="credentialUrl"
              type="url"
              placeholder="https://example.com/my-medical-degree.pdf"
              className="bg-background border-blue-200 dark:border-blue-900/40 text-zinc-900 dark:text-white"
              {...register("credentialUrl", {
                required: "Credential URL is required",
              })}
            />
            {errors.credentialUrl && (
              <p className="text-sm font-medium text-red-500 mt-1">
                {errors.credentialUrl.message as string}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Provide a link to your medical degree or certification
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-700 dark:text-zinc-200">
              Description of Your Services
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your expertise, services, and approach to patient care..."
              rows={4}
              className="bg-background border-blue-200 dark:border-blue-900/40 text-zinc-900 dark:text-white"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description cannot exceed 1000 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-500 mt-1">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="border-blue-200 dark:border-blue-900/40 text-zinc-700 dark:text-zinc-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
