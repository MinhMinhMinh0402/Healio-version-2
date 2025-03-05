import { SidebarNav } from "@/components/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bot, FileText, User, Heart, Activity, PlusCircle } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Appointment, HealthRecord } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user } = useAuth();

  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/appointments/${user?.id}`);
      return res.json();
    },
  });

  const { data: records } = useQuery<HealthRecord[]>({
    queryKey: ["/api/health-records", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/health-records/${user?.id}`);
      return res.json();
    },
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome back, {user?.fullName}</h1>
            <Link href="/ai-assistant">
              <Button className="bg-primary text-white hover:bg-primary/90">
                <PlusCircle className="h-5 w-5 mr-2" />
                Start AI Diagnosis
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-blue-50 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Vitals Today</CardTitle>
                <p className="text-xs text-blue-500">Last updated 2 hours ago</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Heart Rate</p>
                      <p className="text-2xl font-bold text-blue-700">72 bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Blood Pressure</p>
                      <p className="text-2xl font-bold text-blue-700">120/80</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Upcoming Appointments</CardTitle>
                <p className="text-xs text-green-500">Next 7 days</p>
              </CardHeader>
              <CardContent>
                {appointments?.length === 0 ? (
                  <p className="text-sm text-green-600">No upcoming appointments</p>
                ) : (
                  <div className="space-y-2">
                    {appointments?.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">{appointment.doctorName}</p>
                          <p className="text-sm text-green-600">{appointment.clinicName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-900">{appointment.date}</p>
                          <p className="text-sm text-green-600">{appointment.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                {records?.length === 0 ? (
                  <p className="text-sm text-gray-500">No health records found</p>
                ) : (
                  <div className="space-y-2 -mx-2 px-2">
                    {records?.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{record.diagnosis}</p>
                          <p className="text-sm text-gray-500 truncate">Dr. {record.doctor} • {record.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">AI Health Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Get instant AI-powered health analysis</p>
                  <Link href="/ai-assistant">
                    <a className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Start AI Diagnosis
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions moved to bottom */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/appointments">
                <a className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Book Appointment</p>
                    <p className="text-sm text-gray-500">Schedule a visit</p>
                  </div>
                </a>
              </Link>
              <Link href="/ai-assistant">
                <a className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <Bot className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">AI Assistant</p>
                    <p className="text-sm text-gray-500">Get health advice</p>
                  </div>
                </a>
              </Link>
              <Link href="/health-records">
                <a className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Records</p>
                    <p className="text-sm text-gray-500">Medical history</p>
                  </div>
                </a>
              </Link>
              <Link href="/profile">
                <a className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Update Profile</p>
                    <p className="text-sm text-gray-500">Manage account</p>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}