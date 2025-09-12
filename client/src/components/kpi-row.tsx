import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, Activity, FileText, TestTube } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

function KpiCard({ title, value, change, changeType = "neutral", icon }: KpiCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />
      case "negative":
        return <TrendingDown className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white hover:shadow-md transition-all duration-300 hover:scale-105 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 group-hover:text-blue-700 transition-colors duration-200">
          {title}
        </CardTitle>
        <div className="text-blue-600 group-hover:text-blue-700 transition-all duration-200 group-hover:scale-110">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
          {value}
        </div>
        {change && (
          <div className={`flex items-center text-xs ${getChangeColor()} transition-all duration-200`}>
            {getChangeIcon()}
            <span className="ml-1">{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function KpiRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-0">
        <KpiCard
          title="Reports Today"
          value={24}
          change="+12% from yesterday"
          changeType="positive"
          icon={<FileText className="w-4 h-4" />}
        />
      </div>
      <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-100">
        <KpiCard
          title="Pending Tests"
          value={8}
          change="-3 from yesterday"
          changeType="positive"
          icon={<TestTube className="w-4 h-4" />}
        />
      </div>
      <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-200">
        <KpiCard
          title="Active Alerts"
          value={3}
          change="+1 new alert"
          changeType="negative"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>
      <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-300">
        <KpiCard
          title="Outbreak Risk"
          value="Medium"
          change="Stable"
          changeType="neutral"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>
    </div>
  )
}
