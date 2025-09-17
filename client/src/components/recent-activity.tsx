"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, TestTube, Droplets, AlertTriangle } from "lucide-react"
import { ReportsService } from "@/lib/reports"
import { WaterTestsService, WaterTest } from "@/lib/water-tests"

interface Report {
  id: string
  name: string
  location?: string
  date: string
  comment?: string
}

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

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading(true)
        const allActivities: ActivityItem[] = []

        // Fetch recent reports
        try {
          const reportsResponse = await ReportsService.getReports()
          const reports = reportsResponse.reports || []
          
          reports.slice(0, 3).forEach((report: Report) => {
            allActivities.push({
              id: `report-${report.id}`,
              type: "report",
              title: "New waterbody report submitted",
              description: `${report.location} - ${report.comment || 'Report submitted'}`,
              timestamp: report.date,
              user: { 
                name: "Community Member", 
                initials: "CM" 
              }
            })
          })
        } catch (error) {
          console.log('Reports not available for activity feed:', error)
        }

        // Fetch recent water tests
        try {
          const waterTests = await WaterTestsService.getWaterTests()
          
          waterTests.slice(0, 3).forEach((test: WaterTest) => {
            allActivities.push({
              id: `test-${test.id}`,
              type: "water-test",
              title: "Water test completed",
              description: `${test.waterbodyName} - ${test.location}`,
              timestamp: test.dateTime,
              user: { 
                name: "ASHA Worker", 
                initials: "AW" 
              }
            })
          })
        } catch (error) {
          console.log('Water tests not available for activity feed:', error)
        }

        // Sort all activities by timestamp and take the 5 most recent
        allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        const recentActivities = allActivities.slice(0, 5)

        // If no real data available, show demo data
        if (recentActivities.length === 0) {
          setActivities([
            {
              id: "1",
              type: "report",
              title: "New waterbody report submitted",
              description: "Lake Meridian - Unusual algae growth observed",
              timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
              user: { name: "Sarah Johnson", initials: "SJ" },
            },
            {
              id: "2",
              type: "water-test",
              title: "Water test completed",
              description: "River Park - Routine surveillance test",
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              user: { name: "Dr. Michael Chen", initials: "MC" },
            },
            {
              id: "3",
              type: "alert",
              title: "Alert acknowledged",
              description: "Elevated bacteria levels - Lake Meridian",
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              user: { name: "Dr. Emily Rodriguez", initials: "ER" },
            },
          ])
        } else {
          setActivities(recentActivities)
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivities()
  }, [])

  if (loading) {
    return (
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
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
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <span className="text-xs text-gray-500">{formatRelativeTime(item.timestamp)}</span>
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
          ))
        )}
      </CardContent>
    </Card>
  )
}
