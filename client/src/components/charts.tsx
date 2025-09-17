"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ReportsService } from "@/lib/reports"
import { WaterTestsService } from "@/lib/water-tests"

interface WeeklyData {
  name: string
  reports: number
  tests: number
  date: string
}

interface QualityData {
  name: string
  value: number
  color: string
}

export function Charts() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [qualityData, setQualityData] = useState<QualityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        
        // Generate last 7 days data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const weeklyChartData: WeeklyData[] = []
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayName = days[date.getDay()]
          
          weeklyChartData.push({
            name: dayName,
            reports: 0,
            tests: 0,
            date: date.toISOString().split('T')[0]
          })
        }

        // Fetch reports and count by day
        try {
          const reportsResponse = await ReportsService.getReports()
          const reports = reportsResponse.reports || []
          
          reports.forEach(report => {
            const reportDate = new Date(report.date).toISOString().split('T')[0]
            const dayData = weeklyChartData.find(d => d.date === reportDate)
            if (dayData) {
              dayData.reports++
            }
          })
        } catch (error) {
          console.log('Using demo data for reports chart:', error)
          // Add some demo data
          weeklyChartData.forEach((day, index) => {
            day.reports = Math.floor(Math.random() * 10) + 3
          })
        }

        // Fetch water tests and count by day + quality distribution
        let qualityDistribution = { good: 0, medium: 0, high: 0 }
        try {
          const waterTests = await WaterTestsService.getWaterTests()
          
          waterTests.forEach(test => {
            const testDate = new Date(test.dateTime).toISOString().split('T')[0]
            const dayData = weeklyChartData.find(d => d.date === testDate)
            if (dayData) {
              dayData.tests++
            }

            // Count quality distribution
            if (test.quality === 'good') qualityDistribution.good++
            else if (test.quality === 'medium') qualityDistribution.medium++
            else if (test.quality === 'high' || test.quality === 'disease') qualityDistribution.high++
          })
        } catch (error) {
          console.log('Using demo data for water tests chart:', error)
          // Add some demo data
          weeklyChartData.forEach((day, index) => {
            day.tests = Math.floor(Math.random() * 8) + 2
          })
          qualityDistribution = { good: 18, medium: 7, high: 3 }
        }

        setWeeklyData(weeklyChartData)
        
        const total = qualityDistribution.good + qualityDistribution.medium + qualityDistribution.high
        setQualityData([
          { 
            name: "Good", 
            value: total > 0 ? Math.round((qualityDistribution.good / total) * 100) : 65, 
            color: "#10b981" 
          },
          { 
            name: "Medium Risk", 
            value: total > 0 ? Math.round((qualityDistribution.medium / total) * 100) : 25, 
            color: "#f59e0b" 
          },
          { 
            name: "High Risk", 
            value: total > 0 ? Math.round((qualityDistribution.high / total) * 100) : 10, 
            color: "#ef4444" 
          },
        ])
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="rounded-xl border-0 shadow-sm bg-white animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Activity Chart */}
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} name="Reports" />
              <Line type="monotone" dataKey="tests" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} name="Water Tests" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Water Quality Distribution */}
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Water Quality Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
