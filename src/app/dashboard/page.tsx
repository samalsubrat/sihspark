import { KpiRow } from "@/components/kpi-row"
import { Charts } from "@/components/charts"
import { AlertList } from "@/components/alert-list"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>

        <div className="space-y-6">
          {/* KPI Cards */}
          <KpiRow />

          {/* Charts Section */}
          <Charts />

          {/* Alerts and Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AlertList />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
