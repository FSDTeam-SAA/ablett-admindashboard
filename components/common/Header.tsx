"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const headerContent: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Overview",
    description:
      "Welcome back — here's what's happening with A7 Property Solutions.",
  },
  "/services": {
    title: "Our Services",
    description:
      "Manage your service categories and update their content and images.",
  },
  "/portfolio": {
    title: "Portfolio Management",
    description: "Manage project portfolio items displayed on the public website.",
  },
  "/gallery": {
    title: "Project Gallery",
    description:
      "Organize projects and upload gallery images for your completed work.",
  },
  "/inquiries": {
    title: "Contact Inquiries",
    description:
      "View and manage customer inquiries submitted through the website contact form.",
  },
  "/faqs": {
    title: "FAQs Management",
    description: "Manage common questions displayed on the public website.",
  },
  "/settings": {
    title: "Settings",
    description: "Manage your profile and password preferences.",
  },
  "/messages": {
    title: "Messages",
    description: "Reply to customer conversations in real time.",
  },
  "/security": {
    title: "Security",
    description: "Manage your account security and login preferences.",
  },
  "/personal-information": {
    title: "Personal Information",
    description: "Manage your personal information and profile details.",
  },
};

function getHeaderContent(pathname: string) {
  const matchedPath = Object.keys(headerContent)
    .sort((a, b) => b.length - a.length)
    .find((path) => pathname === path || pathname.startsWith(`${path}/`));

  return matchedPath ? headerContent[matchedPath] : headerContent["/"];
}

function getInitials(name?: string | null, email?: string | null) {
  const value = name?.trim() || email?.trim() || "Admin";
  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { title, description } = getHeaderContent(pathname);
  const displayName =
    session?.user?.fullName || session?.user?.name || "Admin";
  const displayEmail = session?.user?.email || "";
  const profileImage = session?.user?.profileImage || session?.user?.image;
  const initials = getInitials(displayName, displayEmail);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[90px] items-center justify-between gap-4  bg-[#E6E6E61A] px-6 lg:left-[300px]">
      <div className="min-w-0">
        <h1 className="truncate text-4xl font-semibold leading-tight text-[#FFFFFF]">
          {title}
        </h1>
        <p className="mt-1 line-clamp-1 text-base leading-5 text-[#8A8A8A]">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Avatar className="size-11 border-2 border-white shadow-sm">
          {profileImage ? (
            <AvatarImage src={profileImage} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-[#4b372f] font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
