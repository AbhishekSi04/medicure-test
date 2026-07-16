/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Users, CreditCard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — MediCure",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }: any) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4">
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-0.5">MediCure Platform</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pending" className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* ── Sidebar Nav ── */}
          <TabsList className="md:col-span-1 h-auto flex sm:flex-row md:flex-col w-full p-1.5 gap-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm self-start">
            <TabsTrigger
              value="pending"
              className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full rounded-xl text-left data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <AlertCircle className="h-4 w-4 mr-2 opacity-70 hidden md:inline" />
              <span className="font-medium">Pending</span>
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full rounded-xl text-left data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Users className="h-4 w-4 mr-2 opacity-70 hidden md:inline" />
              <span className="font-medium">Doctors</span>
            </TabsTrigger>
            <TabsTrigger
              value="payouts"
              className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full rounded-xl text-left data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <CreditCard className="h-4 w-4 mr-2 opacity-70 hidden md:inline" />
              <span className="font-medium">Payouts</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Main Content ── */}
          <div className="md:col-span-3">{children}</div>
        </Tabs>
      </div>
    </div>
  );
}