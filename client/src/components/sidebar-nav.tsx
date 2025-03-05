import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Calendar,
  Bot,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/health-records", label: "Health Records", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
];

export function SidebarNav() {
  const [location] = useLocation();
  const { logoutMutation, user } = useAuth();
  const isMobile = useIsMobile();

  const navContent = (
    <>
      <div className="px-6 py-5 border-b">
        <div className="text-xl font-bold text-primary">HEALIO</div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 z-50">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex flex-col items-center py-2 px-1 rounded-lg",
                    isActive ? "text-primary" : "text-gray-600"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r">
      {navContent}
    </div>
  );
}