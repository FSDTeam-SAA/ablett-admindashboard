"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, CalendarDays, FileText } from "lucide-react";
import { useSession } from "next-auth/react";

import { DashboardStatCard } from "./DashboardStatCard";
import { DashboardStatsSkeleton } from "./DashboardStatsSkeleton";

type DashboardOverview = {
  totalProjects: number;
  totalServices: number;
  quoteRequests: number;
  bookAppointment: number;
};

type DashboardOverviewResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  data?: DashboardOverview;
};

const dashboardOverviewQueryKey = "dashboard-overview";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

async function fetchDashboardOverview(accessToken?: string) {
  const response = await fetch(`${getApiBaseUrl()}/dashboard/overview`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data: DashboardOverviewResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || "Failed to fetch overview.");
  }

  if (!data?.data) {
    throw new Error("Overview data was not found.");
  }

  return data.data;
}

function buildStats(overview: DashboardOverview) {
  return [
    {
      title: "Total Projects",
      value: String(overview.totalProjects),
      icon: Building2,
    },
    // {
    //   title: "Total Services",
    //   value: String(overview.totalServices),
    //   icon: Wrench,
    // },
    {
      title: "Quote Requests",
      value: String(overview.quoteRequests),
      icon: FileText,
    },
    {
      title: "Book Appointment",
      value: String(overview.bookAppointment),
      icon: CalendarDays,
    },
  ];
}

export function DashboardStats() {
  const { data: session, status: sessionStatus } = useSession();
  const accessToken = session?.accessToken;
  const isSessionLoading = sessionStatus === "loading";
  const { data: overview, isLoading } = useQuery({
    queryKey: [dashboardOverviewQueryKey, accessToken],
    queryFn: () => fetchDashboardOverview(accessToken),
    enabled: !isSessionLoading,
  });

  if (isSessionLoading || isLoading) {
    return <DashboardStatsSkeleton />;
  }

  const stats = buildStats(
    overview ?? {
      totalProjects: 0,
      totalServices: 0,
      quoteRequests: 0,
      bookAppointment: 0,
    },
  );

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}
