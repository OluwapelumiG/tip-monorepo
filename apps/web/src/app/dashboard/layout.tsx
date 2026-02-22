"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Find Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Applications", href: "/dashboard/applications", icon: FileText },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
       fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
           <Link href="/dashboard" className="flex items-center gap-2">
             <Image src="/logo.png" alt="Logo" width={32} height={32} />
             <span className="text-xl font-bold text-primary">i'llTip</span>
           </Link>
           <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
             <X className="h-5 w-5" />
           </Button>
        </div>

        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
           <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
             </Button>
             <h1 className="text-lg font-semibold capitalize text-foreground">
               {pathname.split("/").pop() || "Dashboard"}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
             {/* User Avatar Placeholder */}
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
               U
             </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
