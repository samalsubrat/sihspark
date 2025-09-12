import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  source: string
  acknowledged: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Elevated Bacteria Levels",
    description: "Lake Meridian showing increased E. coli levels above safe threshold",
    severity: "high",
    timestamp: "2 hours ago",
    source: "Water Test #WT-2024-0156",
    acknowledged: false,
  },
  {
    id: "2",
    title: "Unusual Symptom Cluster",
    description: "5 patients with similar gastrointestinal symptoms in downtown area",
    severity: "medium",
    timestamp: "4 hours ago",
    source: "Medical Test Analysis",
    acknowledged: false,
  },
  {
    id: "3",
    title: "Routine Monitoring Alert",
    description: "Scheduled water quality check due for River Park location",
    severity: "low",
    timestamp: "6 hours ago",
    source: "Automated System",
    acknowledged: true,
  },
]

function getSeverityColor(severity: Alert["severity"]) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getSeverityIcon(severity: Alert["severity"]) {
  switch (severity) {
    case "critical":
    case "high":
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    case "medium":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "low":
      return <CheckCircle className="w-4 h-4 text-blue-600" />
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-600" />
  }
}

export function AlertList() {
  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${alert.acknowledged ? "bg-gray-50 opacity-75" : "bg-white"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{alert.timestamp}</span>
                    <span>•</span>
                    <span>{alert.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!alert.acknowledged && (
                  <Button variant="outline" size="sm">
                    Acknowledge
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
