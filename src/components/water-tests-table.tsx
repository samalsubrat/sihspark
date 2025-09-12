"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, Droplets, Plus, ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import CreateWaterTestModal from "./create-water-test-modal"
import { WaterTestsService } from "@/lib/water-tests"

// Simple date formatter to avoid hydration issues
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

interface WaterTest {
  id: string
  waterbody_name: string
  test_type: "Surveillance" | "Routine" | "Emergency"
  priority: "Low" | "Medium" | "High"
  conducted_by: string
  chloramines: number
  conductivity: number
  hardness: number
  organic_carbon: number
  solids: number
  sulfate: number
  trihalomethanes: number
  turbidity: number
  ph: number
  predicted_class: number
  risk_probabilities: {
    "0": number
    "1": number
    "2": number
  }
  status: "Pending" | "Completed"
  created_at: string
}

function getStatusColor(status: WaterTest["status"]) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getPriorityColor(priority: WaterTest["priority"]) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Low":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getTestTypeColor(testType: WaterTest["test_type"]) {
  switch (testType) {
    case "Emergency":
      return "bg-red-100 text-red-800 border-red-200"
    case "Surveillance":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Routine":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getRiskLevel(predicted_class: number): { label: string; color: string } {
  switch (predicted_class) {
    case 0:
      return { label: "Safe", color: "bg-green-100 text-green-800 border-green-200" }
    case 1:
      return { label: "Moderate Risk", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    case 2:
      return { label: "High Risk", color: "bg-red-100 text-red-800 border-red-200" }
    default:
      return { label: "Unknown", color: "bg-gray-100 text-gray-800 border-gray-200" }
  }
}

export function WaterTestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [testTypeFilter, setTestTypeFilter] = useState<string>("all")
  const [waterTests, setWaterTests] = useState<WaterTest[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch water tests from database
  const fetchWaterTests = async () => {
    try {
      setLoading(true)
      const data = await WaterTestsService.getWaterTests()
      // Ensure data is always an array
      setWaterTests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching water tests:', error)
      setWaterTests([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWaterTests()
  }, [])

  const handleNewTestCreated = () => {
    setIsModalOpen(false)
    fetchWaterTests() // Refresh the data
  }

  const filteredTests = Array.isArray(waterTests) ? waterTests.filter((test) => {
    const matchesSearch =
      (test.id ? String(test.id).toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (test.waterbody_name ? test.waterbody_name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (test.conducted_by ? test.conducted_by.toLowerCase().includes(searchTerm.toLowerCase()) : false)

    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    const matchesPriority = priorityFilter === "all" || test.priority === priorityFilter
    const matchesTestType = testTypeFilter === "all" || test.test_type === testTypeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesTestType
  }) : []

  const toggleRowExpansion = (testId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Droplets className="h-6 w-6 text-blue-600" />
              Water Quality Tests
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and track water quality test results
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Test
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by ID, waterbody, or technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Test Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Surveillance">Surveillance</SelectItem>
                  <SelectItem value="Routine">Routine</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">Loading water tests...</span>
            </div>
          ) : (
            /* Results Table */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Waterbody</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>Turbidity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Conducted By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        {waterTests.length === 0 ? "No water tests found. Create your first test!" : "No tests match your search criteria."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTests.map((test) => (
                      <React.Fragment key={test.id}>
                        <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRowExpansion(test.id)}>
                          <TableCell>
                            {expandedRows.has(test.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{test.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 truncate">{test.waterbody_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTestTypeColor(test.test_type)}>{test.test_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(test.priority)}>{test.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            {test.status === "Completed" ? (
                              <Badge className={getRiskLevel(test.predicted_class).color}>
                                {getRiskLevel(test.predicted_class).label}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {test.status === "Pending" ? "-" : (test.ph && typeof test.ph === 'number' ? test.ph.toFixed(1) : (test.ph ? Number(test.ph).toFixed(1) : "-"))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {test.status === "Pending" ? "-" : (test.turbidity && typeof test.turbidity === 'number' ? test.turbidity.toFixed(1) : (test.turbidity ? Number(test.turbidity).toFixed(1) : "-"))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="whitespace-nowrap">{formatDate(test.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900 truncate">{test.conducted_by}</div>
                          </TableCell>
                        </TableRow>
                        {/* Expanded Row Details */}
                        {expandedRows.has(test.id) && test.status === "Completed" && (
                          <TableRow>
                            <TableCell colSpan={11} className="bg-muted/25">
                              <div className="p-4">
                                <h4 className="font-semibold mb-3">Detailed Analysis Results</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Chloramines</p>
                                    <p className="text-sm">{test.chloramines && typeof test.chloramines === 'number' ? test.chloramines.toFixed(3) : (test.chloramines ? Number(test.chloramines).toFixed(3) : "-")} mg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Conductivity</p>
                                    <p className="text-sm">{test.conductivity && typeof test.conductivity === 'number' ? test.conductivity.toFixed(1) : (test.conductivity ? Number(test.conductivity).toFixed(1) : "-")} μS/cm</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Hardness</p>
                                    <p className="text-sm">{test.hardness && typeof test.hardness === 'number' ? test.hardness.toFixed(1) : (test.hardness ? Number(test.hardness).toFixed(1) : "-")} mg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Organic Carbon</p>
                                    <p className="text-sm">{test.organic_carbon && typeof test.organic_carbon === 'number' ? test.organic_carbon.toFixed(2) : (test.organic_carbon ? Number(test.organic_carbon).toFixed(2) : "-")} mg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Solids</p>
                                    <p className="text-sm">{test.solids && typeof test.solids === 'number' ? test.solids.toFixed(1) : (test.solids ? Number(test.solids).toFixed(1) : "-")} mg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Sulfate</p>
                                    <p className="text-sm">{test.sulfate && typeof test.sulfate === 'number' ? test.sulfate.toFixed(1) : (test.sulfate ? Number(test.sulfate).toFixed(1) : "-")} mg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Trihalomethanes</p>
                                    <p className="text-sm">{test.trihalomethanes && typeof test.trihalomethanes === 'number' ? test.trihalomethanes.toFixed(3) : (test.trihalomethanes ? Number(test.trihalomethanes).toFixed(3) : "-")} μg/L</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Turbidity</p>
                                    <p className="text-sm">{test.turbidity && typeof test.turbidity === 'number' ? test.turbidity.toFixed(2) : (test.turbidity ? Number(test.turbidity).toFixed(2) : "-")} NTU</p>
                                  </div>
                                </div>
                                
                                {/* Risk Probabilities */}
                                <div className="mt-4">
                                  <h5 className="font-medium mb-2">Risk Assessment Probabilities</h5>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                      <p className="text-sm font-medium text-green-800">Safe</p>
                                      <p className="text-lg font-bold text-green-900">
                                        {(test.risk_probabilities?.["0"] * 100 || 0).toFixed(1)}%
                                      </p>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                      <p className="text-sm font-medium text-yellow-800">Moderate Risk</p>
                                      <p className="text-lg font-bold text-yellow-900">
                                        {(test.risk_probabilities?.["1"] * 100 || 0).toFixed(1)}%
                                      </p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg">
                                      <p className="text-sm font-medium text-red-800">High Risk</p>
                                      <p className="text-lg font-bold text-red-900">
                                        {(test.risk_probabilities?.["2"] * 100 || 0).toFixed(1)}%
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateWaterTestModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={handleNewTestCreated}
      />
    </>
  )
}

export default WaterTestsTable
