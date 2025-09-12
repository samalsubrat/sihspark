"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Calendar, User, Plus, Eye, ChevronDown, ChevronRight } from "lucide-react"

// Simple date formatter to avoid hydration issues
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

interface MedicalTest {
  id: string
  patientId: string
  patientName: string
  testType: string
  results: {
    summary: string
    fullResults: Record<string, string | number | boolean>
  }
  date: string
  conductedBy: string
  status: "pending" | "completed" | "reviewed"
}

const mockMedicalTests: MedicalTest[] = [
  {
    id: "MT-2024-0156",
    patientId: "P-12847",
    patientName: "John D.",
    testType: "Gastrointestinal Panel",
    results: {
      summary: "Elevated bacterial markers detected",
      fullResults: {
        "E. coli": "Positive",
        Salmonella: "Negative",
        Campylobacter: "Negative",
        "WBC Count": "12,500/μL (elevated)",
        CRP: "8.2 mg/L (elevated)",
      },
    },
    date: "2024-01-15",
    conductedBy: "Dr. Sarah Wilson",
    status: "completed",
  },
  {
    id: "MT-2024-0157",
    patientId: "P-12848",
    patientName: "Maria S.",
    testType: "Water-borne Pathogen Screen",
    results: {
      summary: "Cryptosporidium detected",
      fullResults: {
        Cryptosporidium: "Positive",
        Giardia: "Negative",
        Norovirus: "Negative",
        Rotavirus: "Negative",
      },
    },
    date: "2024-01-14",
    conductedBy: "Lab Tech A",
    status: "reviewed",
  },
  {
    id: "MT-2024-0158",
    patientId: "P-12849",
    patientName: "Robert K.",
    testType: "Heavy Metal Screening",
    results: {
      summary: "Processing...",
      fullResults: {},
    },
    date: "2024-01-15",
    conductedBy: "Dr. Michael Chen",
    status: "pending",
  },
]

function getStatusColor(status: MedicalTest["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "reviewed":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function MedicalTestsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tests] = useState(mockMedicalTests)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const filteredTests = tests.filter(
    (test) =>
      test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.conductedBy.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Medical Tests</CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Test
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="min-w-[120px]">Test ID</TableHead>
              <TableHead className="min-w-[150px]">Patient</TableHead>
              <TableHead className="min-w-[180px]">Test Type</TableHead>
              <TableHead className="min-w-[200px]">Results</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[150px]">Conducted By</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => (
              <React.Fragment key={test.id}>
                <TableRow className="group">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(test.id)}
                      className="p-1 h-6 w-6"
                    >
                      {expandedRows.has(test.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{test.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{test.patientName}</div>
                        <div className="text-xs text-gray-500">{test.patientId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{test.testType}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900 truncate">{test.results.summary}</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                            View Full Results
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Test Results - {test.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-900">Summary</h4>
                              <p className="text-sm text-gray-600">{test.results.summary}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Detailed Results</h4>
                              <div className="space-y-2">
                                {Object.entries(test.results.fullResults).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{key}:</span>
                                    <span className="font-medium text-gray-900">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="whitespace-nowrap">{formatDate(test.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 truncate">{test.conductedBy}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(test.id) && (
                  <TableRow>
                    <TableCell colSpan={9} className="bg-gray-50 p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Test Results Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(test.results.fullResults).map(([key, value]) => (
                              <div key={key} className="bg-white p-3 rounded-lg border">
                                <div className="text-sm font-medium text-gray-700">{key}</div>
                                <div className="text-lg font-semibold text-gray-900">{String(value)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm">
                            Download Report
                          </Button>
                          <Button variant="outline" size="sm">
                            Share Results
                          </Button>
                          <Button variant="outline" size="sm">
                            Add Notes
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
