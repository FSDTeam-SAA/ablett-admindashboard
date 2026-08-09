import { Building2, CalendarDays, FileText, Wrench } from "lucide-react";

import { DashboardStatCard } from "./DashboardStatCard";

const stats = [
  { title: "Total Projects", value: "24", icon: Building2 },
  { title: "Total Services", value: "5", icon: Wrench },
  { title: "Quote Requests", value: "23", icon: FileText },
  { title: "Book Appointment", value: "12", icon: CalendarDays },
];

export function DashboardStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}
