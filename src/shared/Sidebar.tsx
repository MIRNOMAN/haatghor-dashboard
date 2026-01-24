"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  Image,
  Settings,
  LogOut,
  HelpCircle,
  MessageSquare,
  Mail,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Banners",
    href: "/banners",
    icon: Image,
  },
];

const contentItems = [
  {
    title: "Reviews",
    href: "/reviews",
    icon: MessageSquare,
  },
  {
    title: "FAQ",
    href: "/faq",
    icon: HelpCircle,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    icon: FileText,
  },
];

const settingsItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-col md:w-64 border rounded-lg bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold tracking-tight">HaatGhor</h2>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}

          <Separator className="my-2" />
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
            CONTENT
          </div>

          {contentItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}

          <Separator className="my-2" />

          {settingsItems.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
