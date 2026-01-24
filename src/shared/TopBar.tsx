"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users as UsersIcon,
  FolderOpen,
  Image,
  HelpCircle,
  MessageSquare,
  Mail,
  FileText,
} from "lucide-react";

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
    icon: UsersIcon,
  },
  {
    title: "Banners",
    href: "/banners",
    icon: Image,
  },
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
    title: "Privacy",
    href: "/privacy-policy",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function TopBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border rounded-lg bg-card p-4">
      {/* Left Section - Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>HaatGhor Dashboard</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || 
                               (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
            <div className="mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:block">
          <h1 className="text-xl font-bold">Welcome Back!</h1>
          <p className="text-sm text-muted-foreground">
            Manage your e-commerce platform
          </p>
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="flex gap-3 p-2 hover:bg-accent rounded-md cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-muted-foreground">
                    Order #1234 - 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-2 hover:bg-accent rounded-md cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-medium">Product out of stock</p>
                  <p className="text-xs text-muted-foreground">
                    iPhone 15 Pro - 1 hour ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-2 hover:bg-accent rounded-md cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    John Doe - 3 hours ago
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@haatghor.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
