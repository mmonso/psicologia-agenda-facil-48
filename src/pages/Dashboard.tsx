
import { PageLayout } from "@/components/layout/PageLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { NextAppointments } from "@/components/dashboard/NextAppointments";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <WeeklyCalendar />
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueChart />
          <div className="space-y-6">
            <NextAppointments />
            <RecentPayments />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
