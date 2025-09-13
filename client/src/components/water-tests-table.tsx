"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Droplets, Plus, ChevronDown, ChevronRight, Loader2 } from "lucide-react"
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
  waterbodyName: string
  waterbodyId?: string
  dateTime: string
  location: string
  latitude?: number
  longitude?: number
  photoUrl: string
  notes: string
  quality: "good" | "medium" | "high" | "disease"
  ashaId: string
  createdAt: string
}

function getQualityColor(quality: WaterTest["quality"]) {
  switch (quality) {
    case "good":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "disease":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getQualityLabel(quality: WaterTest["quality"]) {
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
      return "Unknown"
  }
}



export function WaterTestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [qualityFilter, setQualityFilter] = useState<string>("all")
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
      (test.waterbodyName ? test.waterbodyName.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (test.location ? test.location.toLowerCase().includes(searchTerm.toLowerCase()) : false)

    const matchesQuality = qualityFilter === "all" || test.quality === qualityFilter

    return matchesSearch && matchesQuality
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
                placeholder="Search by ID, waterbody, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quality</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="disease">Disease Risk</SelectItem>
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
                    <TableHead>Location</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                              <span className="font-medium text-gray-900 truncate">{test.waterbodyName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 truncate">{test.location}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getQualityColor(test.quality)}>
                              {getQualityLabel(test.quality)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(test.dateTime)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 truncate max-w-[200px]">
                              {test.notes}
                            </div>
                          </TableCell>
                        </TableRow>
                        {/* Expanded Row Details */}
                        {expandedRows.has(test.id) && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/25">
                              <div className="p-4">
                                <h4 className="font-semibold mb-3">Test Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Waterbody ID</p>
                                      <p className="text-sm">{test.waterbodyId || "N/A"}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Location</p>
                                      <p className="text-sm">{test.location}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Coordinates</p>
                                      <p className="text-sm">
                                        {test.latitude && test.longitude 
                                          ? `${test.latitude.toFixed(6)}, ${test.longitude.toFixed(6)}`
                                          : "N/A"
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Test Date</p>
                                      <p className="text-sm">{formatDate(test.dateTime)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Created</p>
                                      <p className="text-sm">{formatDate(test.createdAt)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-600">Photo</p>
                                      <a 
                                        href={test.photoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                      >
                                        View Photo
                                      </a>
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
