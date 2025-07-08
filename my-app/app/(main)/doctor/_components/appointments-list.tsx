/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import AppointmentCard from "@/components/appointment-card";

interface AppointmentSettingsProps {
    appointments: any[];
}   

export default function DoctorAppointmentsList({appointments}: AppointmentSettingsProps) {
    return (
        <Card className="border-blue-900/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white text-center flex items-center">
              <Calendar className="h-5 w-5 mr-2  text-blue-400" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    userRole="DOCTOR"
                    refetchAppointments={() => window.location.reload()}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any scheduled appointments yet. Make sure
                  you&apos;ve set your availability to allow patients to book.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      );
}
