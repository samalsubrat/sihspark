"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, Clock, Search, Filter, Eye, MessageSquare, Link } from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "acknowledged" | "resolved" | "investigating"
  timestamp: string
  source: {
    type: "medical_test" | "water_test" | "report" | "system"
    id: string
    name: string
  }
  assignedTo?: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  notes?: string[]
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-2024-001",
    title: "Critical Bacteria Levels Detected",
    description: "E. coli levels in Lake Meridian exceed safe thresholds by 300%. Immediate action required.",
    severity: "critical",
    status: "active",
    timestamp: "2024-01-15 14:30:00",
    source: {
      type: "water_test",
      id: "WT-2024-0156",
      name: "Lake Meridian Emergency Test",
    },
    assignedTo: "Dr. Sarah Wilson",
  },
  {
    id: "ALT-2024-002",
    title: "Unusual Symptom Cluster",
    description: "5 patients with similar gastrointestinal symptoms reported in downtown area within 24 hours.",
    severity: "high",
    status: "investigating",
    timestamp: "2024-01-15 10:15:00",
    source: {
      type: "medical_test",
      id: "MT-2024-0157",
      name: "Patient Symptom Analysis",
    },
    assignedTo: "Dr. Michael Chen",
    acknowledgedBy: "Dr. Michael Chen",
    acknowledgedAt: "2024-01-15 10:30:00",
    notes: ["Contacted local health department", "Initiated contact tracing"],
  },
  {
    id: "ALT-2024-003",
    title: "Community Report: Dead Fish",
    description: "Multiple dead fish observed in Downtown Pond. Potential contamination event.",
    severity: "medium",
    status: "acknowledged",
    timestamp: "2024-01-14 16:45:00",
    source: {
      type: "report",
      id: "WR-2024-003",
      name: "Downtown Pond Report",
    },
    assignedTo: "Lab Tech B",
    acknowledgedBy: "Lab Tech B",
    acknowledgedAt: "2024-01-14 17:00:00",
  },
  {
    id: "ALT-2024-004",
    title: "Routine Monitoring Overdue",
    description: "Scheduled water quality check for River Park is 2 days overdue.",
    severity: "low",
    status: "resolved",
    timestamp: "2024-01-13 09:00:00",
    source: {
      type: "system",
      id: "SYS-MONITOR-001",
      name: "Automated Monitoring System",
    },
    assignedTo: "Lab Tech A",
    acknowledgedBy: "Lab Tech A",
    acknowledgedAt: "2024-01-13 14:30:00",
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

function getStatusColor(status: Alert["status"]) {
  switch (status) {
    case "active":
      return "bg-red-100 text-red-800 border-red-200"
    case "investigating":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "acknowledged":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200"
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

function AlertCard({ alert }: { alert: Alert }) {
  const [notes, setNotes] = useState("")

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {getSeverityIcon(alert.severity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">{alert.description}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span>ID: {alert.id}</span>
                {alert.assignedTo && (
                  <>
                    <span>•</span>
                    <span>Assigned to: {alert.assignedTo}</span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Link className="w-4 h-4" />
                <span>Source: {alert.source.name}</span>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                  View Source
                </Button>
              </div>

              {alert.acknowledgedBy && (
                <div className="text-xs text-gray-500 mb-3">
                  Acknowledged by {alert.acknowledgedBy} at {new Date(alert.acknowledgedAt!).toLocaleString()}
                </div>
              )}

              {alert.notes && alert.notes.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {alert.notes.map((note, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-2">
            {alert.status === "active" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Acknowledge
              </Button>
            )}
            {alert.status === "acknowledged" && (
              <Button size="sm" variant="outline">
                Mark Investigating
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Note to Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea placeholder="Enter your note..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Note</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function AlertsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [alerts] = useState(mockAlerts)

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter

    return matchesSearch && matchesSeverity && matchesStatus
  })

  const activeAlerts = filteredAlerts.filter((alert) => alert.status === "active")
  const acknowledgedAlerts = filteredAlerts.filter(
    (alert) => alert.status === "acknowledged" || alert.status === "investigating",
  )
  const resolvedAlerts = filteredAlerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Alert Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="acknowledged">In Progress ({acknowledgedAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {activeAlerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No active alerts</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          {acknowledgedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {acknowledgedAlerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No alerts in progress</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
          {resolvedAlerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No resolved alerts</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
