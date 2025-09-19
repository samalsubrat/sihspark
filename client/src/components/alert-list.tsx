"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import { AlertService, type Alert } from "@/lib/alerts"

interface DisplayAlert {
  id: string
  title: string
  description: string
  severity: string
  timestamp: string
  source: string
  acknowledged: boolean
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
    case "high":
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    case "medium":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "low":
      return <Shield className="w-4 h-4 text-green-600" />
    default:
      return <CheckCircle className="w-4 h-4 text-gray-600" />
  }
}

export function AlertList() {
  const [alerts, setAlerts] = useState<DisplayAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const response = await AlertService.getAllAlerts()
        const alertsData = response.alerts || []
        
        // Transform alerts data for display and limit to 5 most recent
        const displayAlerts: DisplayAlert[] = alertsData.slice(0, 5).map((alert: Alert) => ({
          id: alert.id,
          severity: alert.waterTest?.quality === 'high' || alert.waterTest?.quality === 'disease' ? 'high' : 
                   alert.waterTest?.quality === 'medium' ? 'medium' : 'low',
          title: alert.message?.split(' - ')[0] || 'Water Quality Alert',
          description: alert.message || 'Water quality issue detected',
          timestamp: new Date(alert.createdAt).toLocaleString(),
          source: `${alert.waterTest?.waterbodyName || 'Unknown'} - ${alert.waterTest?.location || 'Unknown location'}`,
          acknowledged: false
        }))
        
        setAlerts(displayAlerts)
      } catch (error) {
        console.log('Using demo alerts data:', error)
        // Fallback to demo data
        const demoAlerts: DisplayAlert[] = [
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
            title: "Medium Risk Water Quality",
            description: "Water quality test shows moderate contamination levels",
            severity: "medium", 
            timestamp: "4 hours ago",
            source: "Field Report",
            acknowledged: false,
          },
          {
            id: "3",
            title: "Routine Monitoring Alert",
            description: "Scheduled water quality check completed successfully",
            severity: "low",
            timestamp: "6 hours ago",
            source: "Automated System",
            acknowledged: true,
          },
        ]
        setAlerts(demoAlerts)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert: DisplayAlert) => (
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
          ))
        )}
      </CardContent>
    </Card>
  )
}
