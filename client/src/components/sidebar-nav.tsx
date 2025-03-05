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
  const { logoutMutation } = useAuth();
  const isMobile = useIsMobile();

  const navContent = (
    <>
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="text-primary font-bold text-xl">Healio</div>
      </div>

      <nav className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center p-2 rounded-md",
                  isActive ? "text-primary" : "text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 h-screen flex flex-col border-r bg-white">
      {navContent}
    </div>
  );
}