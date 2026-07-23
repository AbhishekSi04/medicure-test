import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import { AvailabilitySettings } from "./_components/availability-settings";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";
import { Calendar, Clock, DollarSign, MessageSquare, User, Stethoscope } from "lucide-react";
import DoctorAppointmentsList from "./_components/appointments-list";
import DoctorEarnings from "./_components/doctor-earnings";
import DoctorMessages from "./_components/doctor-messages";
import DoctorProfile from "./_components/doctor-profile";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();

  const [appointmentsData, availabilityData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorAvailability(),
  ]);

  if (user?.role !== "DOCTOR") redirect("/onboarding");
  if (user?.verificationStatus !== "VERIFIED") redirect("/doctor/verification");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Page Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-4">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-0.5">MediCure Platform</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Doctor Dashboard
            </h1>
          </div>
          {user?.name && (
            <p className="ml-auto text-blue-200 text-sm hidden sm:block">
              Welcome, <span className="text-white font-semibold">{user.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="earnings" className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Nav */}
          <TabsList className="md:col-span-1 h-auto flex sm:flex-row md:flex-col w-full p-1.5 gap-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm self-start overflow-x-auto hide-scrollbar-desktop">
            {[
              { value: "earnings", icon: DollarSign, label: "Earnings" },
              { value: "appointments", icon: Calendar, label: "Appointments" },
              { value: "availability", icon: Clock, label: "Availability" },
              { value: "message", icon: MessageSquare, label: "Messages" },
              { value: "profile", icon: User, label: "Profile" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full rounded-xl text-left data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Icon className="h-4 w-4 mr-2 opacity-70 hidden md:inline" />
                <span className="font-medium">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-4">
            <TabsContent value="appointments" className="border-none p-0 mt-0">
              <DoctorAppointmentsList appointments={appointmentsData.appointments || []} />
            </TabsContent>
            <TabsContent value="availability" className="border-none p-0 mt-0">
              <AvailabilitySettings slots={availabilityData.slots || []} />
            </TabsContent>
            <TabsContent value="earnings" className="border-none p-0 mt-0">
              <DoctorEarnings />
            </TabsContent>
            <TabsContent value="message" className="border-none p-0 mt-0">
              <DoctorMessages />
            </TabsContent>
            <TabsContent value="profile" className="border-none p-0 mt-0">
              <DoctorProfile user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}