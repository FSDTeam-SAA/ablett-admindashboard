"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CircleHelp,
  // FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MessageSquareText,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  // { name: "Services Management", href: "/services", icon: FileText },
  { name: "Portfolio Management", href: "/portfolio", icon: Wrench },
  { name: "Inquiries Management", href: "/inquiries", icon: MessageSquare },
  { name: "FAQ's", href: "/faqs", icon: CircleHelp },
  { name: "Messages", href: "/messages", icon: MessageSquareText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed left-4 top-4 z-50 rounded-md bg-[#161616] p-2.5 text-white shadow-lg transition-colors hover:bg-[#242424] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "sticky bottom-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-[#252525] bg-[#151515] transition-transform duration-300",
          "fixed lg:static",
          "w-[300px]",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="relative flex items-center justify-center px-4 pb-4 pt-3">
          <Link href="/">
            <div className="flex h-[56px] items-center justify-center">
              <Image
                src="/logo.png"
                alt="A7 Property Solutions"
                width={120}
                height={64}
                priority
                className="h-[51px] w-[104px] object-contain"
              />
            </div>
          </Link>

          {isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="absolute right-3 top-1/2 rounded-md p-2 text-[#b8b8b8] transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex h-12 w-full items-center gap-2 rounded-[3px] px-2 text-[18px] font-normal leading-none transition-colors duration-200",
                  isActive
                    ? "bg-[#5a5a5a] text-[#d7d7d7]"
                    : "text-[#8a8a8a] hover:bg-[#2a2a2a] hover:text-[#d0d0d0]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-[20px] w-[20px] flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-[#d7d7d7]" : "text-[#8a8a8a]",
                  )}
                  strokeWidth={1.7}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-4 pt-6">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="size-12 border border-[#3a3a3a]">
              <AvatarFallback className="bg-[#4b372f] text-[14px] font-semibold text-white">
                JW
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[18px] font-semibold leading-3 text-[#f1f1f1]">
                Jenny Wilson
              </p>
              <p className="truncate text-[14px] mt-3 leading-3 text-[#8a8a8a]">
                example@example.com
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[3px] border border-[#cf3349] text-[16px] font-medium text-[#ff4d62] transition-colors hover:bg-[#cf3349] hover:text-white"
          >
            <LogOut className="h-[13px] w-[13px]  flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="max-w-[440px] p-6 bg-white">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-2xl font-semibold text-[#000000]">
              Logout confirmation
            </DialogTitle>
            <DialogDescription className="mt-2 text-base leading-6 text-[#7D7D7D]">
              Are you sure you want to logout from the admin dashboard?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isLoggingOut}
              onClick={() => setIsLogoutModalOpen(false)}
              className="h-[44px] min-w-[110px] border-[#007066] bg-transparent text-base font-medium text-[#007066] hover:bg-[#E6F1F0]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="h-[44px] min-w-[110px] bg-[#B42318] text-base font-medium text-white hover:bg-[#9F1F16]"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
