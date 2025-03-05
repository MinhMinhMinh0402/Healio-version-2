import { SidebarNav } from "@/components/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bot, FileText, User } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.fullName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Link href="/appointments">
            <a>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Schedule and manage your appointments</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/ai-assistant">
            <a>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                  <Bot className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Get instant health advice</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/health-records">
            <a>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                  <FileText className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">View your medical history</p>
                </CardContent>
              </Card>
            </a>
          </Link>

          <Link href="/profile">
            <a>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Profile</CardTitle>
                  <User className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Manage your account settings</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
