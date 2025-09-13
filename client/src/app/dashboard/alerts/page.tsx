"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AlertService, type Alert, type AlertStats } from "@/lib/alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  AlertTriangle, 
  Search, 
  Filter,
  Loader2,
  Users,
  Globe,
  Clock,
  Droplets,
  MapPin,
  User
} from "lucide-react"

function getAlertTypeBadgeColor(type: string) {
  switch (type) {
    case "leader":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "global":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getQualityBadgeColor(quality: string) {
  switch (quality) {
    case "good":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "disease":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function formatQuality(quality: string) {
  switch (quality) {
    case "good":
      return "Good"
    case "medium":
      return "Medium"
    case "high":
      return "High Risk"
    case "disease":
      return "Disease Risk"
    default:
      return quality
  }
}

export default function AlertsPage() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<AlertStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [alertTypeFilter, setAlertTypeFilter] = useState<string>("all")

  // Only admin and leader users should access this page
  if (!user || !["admin", "leader"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You need admin or leader privileges to access alerts.
          </p>
        </div>
      </div>
    )
  }

  // Load alerts and statistics
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [alertsResponse, statsResponse] = await Promise.all([
          AlertService.getAllAlerts(100),
          AlertService.getAlertStats()
        ])
        
        setAlerts(alertsResponse.alerts)
        setStats(statsResponse.stats)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load alerts'
        setError(errorMessage)
        console.error('Error loading alerts:', err)
        
        // Set demo data for development
        setAlerts([
          {
            id: '1',
            message: '⚠️ Medium Water Quality at Lake Victoria',
            type: 'leader',
            createdAt: new Date().toISOString(),
            waterTest: {
              id: 'wt1',
              waterbodyName: 'Lake Victoria',
              location: 'Kampala, Uganda',
              quality: 'medium',
              dateTime: new Date().toISOString(),
              asha: {
                id: 'asha1',
                name: 'Sarah Johnson',
                email: 'sarah@example.com'
              }
            },
            leader: {
              id: 'leader1',
              name: 'John Doe',
              email: 'john@example.com'
            }
          },
          {
            id: '2',
            message: '🚨 High Risk Water Quality detected at River Nile',
            type: 'global',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            waterTest: {
              id: 'wt2',
              waterbodyName: 'River Nile',
              location: 'Cairo, Egypt',
              quality: 'high',
              dateTime: new Date(Date.now() - 3600000).toISOString(),
              asha: {
                id: 'asha2',
                name: 'Ahmed Hassan',
                email: 'ahmed@example.com'
              }
            }
          }
        ])
        setStats({
          totalLeaderAlerts: 1,
          totalGlobalAlerts: 1,
          totalAlerts: 2,
          recentAlerts: 2
        })
        setError(`Backend not available (${errorMessage}). Showing demo data.`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.waterTest.waterbodyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.waterTest.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = alertTypeFilter === "all" || alert.type === alertTypeFilter
    
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Water Quality Alerts</h1>
          <p className="text-gray-600">
            Monitor water quality alerts and notifications from ASHA workers
          </p>
          <div className="mt-2 text-sm text-blue-600">
            Logged in as: <span className="font-medium">{user.email}</span> ({user.role})
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</div>
                <p className="text-xs text-gray-500">All water quality alerts</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Leader Alerts</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalLeaderAlerts}</div>
                <p className="text-xs text-gray-500">Medium quality alerts</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Global Alerts</CardTitle>
                <Globe className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.totalGlobalAlerts}</div>
                <p className="text-xs text-gray-500">High risk alerts</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Recent (24h)</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.recentAlerts}</div>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8 bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              Filter Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts, waterbodies, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={alertTypeFilter} onValueChange={setAlertTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="leader">Leader Alerts</SelectItem>
                  <SelectItem value="global">Global Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Alerts</CardTitle>
            {error && (
              <div className={`text-sm p-3 rounded-lg border ${
                error.includes('Backend not available') 
                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {error}
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading alerts...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Alert Details</TableHead>
                    <TableHead className="min-w-[150px]">Water Test</TableHead>
                    <TableHead className="min-w-[120px]">Quality</TableHead>
                    <TableHead className="min-w-[120px]">Type</TableHead>
                    <TableHead className="min-w-[150px]">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No alerts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 mb-1">{alert.message}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.waterTest.location}
                            </div>
                            {alert.leader && (
                              <div className="text-xs text-gray-400 mt-1">
                                Leader: {alert.leader.name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{alert.waterTest.waterbodyName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alert.waterTest.asha.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getQualityBadgeColor(alert.waterTest.quality)}>
                            {formatQuality(alert.waterTest.quality)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAlertTypeBadgeColor(alert.type)}>
                            {alert.type === 'leader' ? 'Leader Alert' : 'Global Alert'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(alert.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}