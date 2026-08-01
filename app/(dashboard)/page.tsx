import { DashboardStats } from "@/components/dashboard-component/DashboardStats";
import { ProjectStatisticsChart } from "@/components/dashboard-component/ProjectStatisticsChart";

const Page = () => {
  return (
    <main className="space-y-4">
      <DashboardStats />
      <ProjectStatisticsChart />
    </main>
  );
};

export default Page;
