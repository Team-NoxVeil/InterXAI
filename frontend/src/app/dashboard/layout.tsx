"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  BrainCircuit, 
  BarChart, 
  BookOpen, 
  Bookmark, 
  Settings, 
  Search, 
  Bell 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Interviews", href: "/dashboard/interviews", icon: Video },
  { name: "Mock Interview", href: "/dashboard/interview", icon: BrainCircuit },
  { name: "Skills Analysis", href: "/dashboard/skills", icon: BarChart },
  { name: "Feedback", href: "/dashboard/feedback", icon: BarChart },
  { name: "Learning Hub", href: "/dashboard/learning", icon: BookOpen },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white/50 backdrop-blur-md hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              I
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              InterXAI
            </span>
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
            <h4 className="font-bold text-sm mb-1 text-foreground">Pro Plan</h4>
            <p className="text-xs text-muted-foreground mb-3">12 days left</p>
            <button className="w-full text-xs font-semibold bg-white text-primary px-3 py-1.5 rounded-lg shadow-sm border border-border">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-border bg-white/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search interviews, skills, etc..." 
              className="pl-9 bg-white/60 border-border/50 rounded-full h-10"
            />
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">Alex Morgan</p>
                <p className="text-xs text-muted-foreground mt-1">Software Engineer</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Morgan" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
