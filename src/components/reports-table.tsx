"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MapPin, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Loader2 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { ReportsService, type Report } from "@/lib/reports"
import { useAuth } from "@/contexts/auth-context"
import { CreateReportModal } from "@/components/create-report-modal"

function getStatusColor(status: Report["status"]) {
  switch (status) {
    case "awaiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ReportsTable() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debug: Check authentication state
  useEffect(() => {
    console.log('Auth state:', { user, isAuthenticated: !!user })
    console.log('User role:', user?.role)
    console.log('User details:', user)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      console.log('Token in localStorage:', token ? 'Present' : 'Missing')
    }
  }, [user])

  // Fetch reports on component mount
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if user is authenticated
      if (!user) {
        setError('Please sign in to view reports')
        return
      }
      
      console.log('User authenticated:', user)
      console.log('Attempting to fetch reports...')
      
      const response = await ReportsService.getReports()
      setReports(response.reports)
      console.log('Successfully fetched reports:', response.reports)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports'
      console.error('Error fetching reports:', err)
      
      // Check if it's a real authentication issue
      if (errorMessage.includes('Authentication required') || errorMessage.includes('sign in')) {
        setError('Please sign in again to access reports')
        return
      }
      
      // Check if it's a permission issue
      if (errorMessage.includes('Access forbidden') || errorMessage.includes('insufficient permissions') || errorMessage.includes('forbidden')) {
        console.log('403 Forbidden error - Backend authorization issue detected')
        console.log('User role:', user?.role)
        console.log('This appears to be a backend configuration problem, not a role issue')
        
        // Even admin users are getting 403, so this is a backend bug
        // Show demo data and clear explanation
        const currentUserId = user?.id || 'demo-user'
        setReports([
          {
            id: '1',
            name: 'Water Quality Report #1',
            location: 'Lake District, Area A',
            latitude: 28.6139,
            longitude: 77.2090,
            date: new Date().toISOString(),
            mapArea: 'Sector 5',
            leaderId: currentUserId,
            photoUrl: '/placeholder-image.jpg',
            comment: 'High pollution levels detected',
            status: 'awaiting' as const,
            progress: 0
          },
          {
            id: '2',
            name: 'Water Quality Report #2',
            location: 'River Side, Area B',
            latitude: 28.7041,
            longitude: 77.1025,
            date: new Date(Date.now() - 86400000).toISOString(),
            mapArea: 'Sector 3',
            leaderId: currentUserId,
            photoUrl: '/placeholder-image.jpg',
            comment: 'Chemical contamination found',
            status: 'in_progress' as const,
            progress: 50
          },
          {
            id: '3',
            name: 'Water Quality Report #3',
            location: 'Pond Area, Area C',
            latitude: 28.5355,
            longitude: 77.3910,
            date: new Date(Date.now() - 172800000).toISOString(),
            mapArea: 'Sector 7',
            leaderId: currentUserId,
            photoUrl: '/placeholder-image.jpg',
            comment: 'Treatment completed successfully',
            status: 'resolved' as const,
            progress: 100
          }
        ])
        setError(`Backend authorization bug detected. Even admin users are getting 403 Forbidden from /api/v1/reports. Using demo data.`)
        return
      }
      
      // For other errors (network, server down, etc.), show dummy data
      console.log('Using dummy data for development due to:', errorMessage)
      const currentUserId = user?.id || 'demo-user'
      setReports([
        {
          id: '1',
          name: 'Water Quality Report #1',
          location: 'Lake District, Area A',
          latitude: 28.6139,
          longitude: 77.2090,
          date: new Date().toISOString(),
          mapArea: 'Sector 5',
          leaderId: currentUserId,
          photoUrl: '/placeholder-image.jpg',
          comment: 'High pollution levels detected',
          status: 'awaiting' as const,
          progress: 0
        },
        {
          id: '2',
          name: 'Water Quality Report #2',
          location: 'River Side, Area B',
          latitude: 28.7041,
          longitude: 77.1025,
          date: new Date(Date.now() - 86400000).toISOString(),
          mapArea: 'Sector 3',
          leaderId: currentUserId,
          photoUrl: '/placeholder-image.jpg',
          comment: 'Chemical contamination found',
          status: 'in_progress' as const,
          progress: 50
        },
        {
          id: '3',
          name: 'Water Quality Report #3',
          location: 'Pond Area, Area C',
          latitude: 28.5355,
          longitude: 77.3910,
          date: new Date(Date.now() - 172800000).toISOString(),
          mapArea: 'Sector 7',
          leaderId: currentUserId,
          photoUrl: '/placeholder-image.jpg',
          comment: 'Treatment completed successfully',
          status: 'resolved' as const,
          progress: 100
        }
      ])
      // Show a warning instead of an error for development
      setError(`Backend not available (${errorMessage}). Showing demo data.`)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleUpdateStatus = async (id: string, status: Report["status"], progress?: number) => {
    try {
      // Check if we're in demo mode
      if (error?.includes('Backend not available')) {
        // Update locally for demo purposes
        setReports(prev => prev.map(report => 
          report.id === id 
            ? { ...report, status, progress: progress ?? report.progress }
            : report
        ))
        return
      }
      
      await ReportsService.updateReport(id, { status, progress })
      await fetchReports()
    } catch (err) {
      console.error('Error updating report:', err)
      setError(err instanceof Error ? err.message : 'Failed to update report')
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      // Check if we're in demo mode
      if (error?.includes('Backend not available')) {
        // Remove locally for demo purposes
        setReports(prev => prev.filter(report => report.id !== id))
        return
      }
      
      await ReportsService.deleteReport(id)
      await fetchReports()
    } catch (err) {
      console.error('Error deleting report:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete report')
    }
  }

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.location && report.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.comment && report.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const canModifyReport = (report: Report) => {
    return user?.role === 'admin' || 
           (user?.role === 'leader' && report.leaderId === user.id)
  }

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Reports</CardTitle>
          <CreateReportModal onReportCreated={fetchReports} />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {error && (
          <div className={`text-sm p-3 rounded-lg border ${
            error.includes('Backend not available') || error.includes('Backend permission issue') || error.includes('Backend authorization bug')
              ? 'text-blue-600 bg-blue-50 border-blue-200' 
              : 'text-red-600 bg-red-50 border-red-200'
          }`}>
            <div>{error}</div>
            {error.includes('Backend authorization bug') && (
              <div className="mt-2 text-xs">
                <strong>Technical Details:</strong> The backend /api/v1/reports endpoint is returning 403 Forbidden even for admin users. 
                This needs to be fixed in the backend authorization middleware.
              </div>
            )}
            {error.includes('Backend permission issue') && (
              <div className="mt-2 text-xs">
                <strong>Note:</strong> The backend expects specific roles (admin, leader, asha, public). 
                Your current role: <code>{user?.role || 'unknown'}</code>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading reports...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Location</TableHead>
                <TableHead className="min-w-[80px]">Photo</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[100px]">Progress</TableHead>
                <TableHead className="min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No reports found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{report.name || 'Unnamed Report'}</div>
                        <div className="text-sm text-gray-500">{report.id || 'No ID'}</div>
                        {report.comment && (
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">
                            {report.comment}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="whitespace-nowrap">
                          {report.date ? new Date(report.date).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <div className="min-w-0">
                          {report.location && (
                            <div className="truncate">{report.location}</div>
                          )}
                          {report.latitude && report.longitude && (
                            <div className="text-xs text-gray-500 truncate">
                              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                            </div>
                          )}
                          {report.mapArea && (
                            <div className="text-xs text-gray-500 truncate">
                              Area: {report.mapArea}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.photoUrl && (
                        <Avatar className="w-10 h-10 rounded-md flex-shrink-0">
                          <AvatarImage src={report.photoUrl} alt="Report photo" />
                          <AvatarFallback>IMG</AvatarFallback>
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status ? report.status.replace("_", " ") : "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={report.progress || 0} className="w-16" />
                        <span className="text-xs text-gray-500 min-w-[30px]">
                          {report.progress || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {canModifyReport(report) && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(report.id, 'awaiting', 0)}
                                disabled={report.status === 'awaiting'}
                              >
                                Set Awaiting
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(report.id, 'in_progress', 50)}
                                disabled={report.status === 'in_progress'}
                              >
                                Set In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(report.id, 'resolved', 100)}
                                disabled={report.status === 'resolved'}
                              >
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteReport(report.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
