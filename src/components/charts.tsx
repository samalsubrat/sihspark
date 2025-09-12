"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const weeklyData = [
  { name: "Mon", reports: 12, tests: 8, alerts: 2 },
  { name: "Tue", reports: 19, tests: 12, alerts: 1 },
  { name: "Wed", reports: 15, tests: 10, alerts: 3 },
  { name: "Thu", reports: 22, tests: 15, alerts: 2 },
  { name: "Fri", reports: 18, tests: 11, alerts: 1 },
  { name: "Sat", reports: 8, tests: 5, alerts: 0 },
  { name: "Sun", reports: 6, tests: 3, alerts: 1 },
]

const testResultsData = [
  { name: "Normal", value: 65, color: "#10b981" },
  { name: "Elevated", value: 25, color: "#f59e0b" },
  { name: "Critical", value: 10, color: "#ef4444" },
]

export function Charts() {
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
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              <Line type="monotone" dataKey="tests" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Test Results Distribution */}
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Test Results Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testResultsData}>
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
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
