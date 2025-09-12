import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, TestTube, Droplets, AlertTriangle } from "lucide-react"

interface ActivityItem {
  id: string
  type: "report" | "medical-test" | "water-test" | "alert"
  title: string
  description: string
  timestamp: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "report",
    title: "New waterbody report submitted",
    description: "Lake Meridian - Unusual algae growth observed",
    timestamp: "15 minutes ago",
    user: { name: "Sarah Johnson", initials: "SJ" },
  },
  {
    id: "2",
    type: "water-test",
    title: "Water test completed",
    description: "River Park - Routine surveillance test",
    timestamp: "1 hour ago",
    user: { name: "Dr. Michael Chen", initials: "MC" },
  },
  {
    id: "3",
    type: "medical-test",
    title: "Medical test results uploaded",
    description: "Patient #12847 - Gastrointestinal panel",
    timestamp: "2 hours ago",
    user: { name: "Lab Tech A", initials: "LT" },
  },
  {
    id: "4",
    type: "alert",
    title: "Alert acknowledged",
    description: "Elevated bacteria levels - Lake Meridian",
    timestamp: "3 hours ago",
    user: { name: "Dr. Emily Rodriguez", initials: "ER" },
  },
]

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "report":
      return <FileText className="w-4 h-4 text-blue-600" />
    case "medical-test":
      return <TestTube className="w-4 h-4 text-green-600" />
    case "water-test":
      return <Droplets className="w-4 h-4 text-cyan-600" />
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-orange-600" />
    default:
      return <FileText className="w-4 h-4 text-gray-600" />
  }
}

export function RecentActivity() {
  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{getActivityIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                  <AvatarFallback className="text-xs">{item.user.initials}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-500">{item.user.name}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
