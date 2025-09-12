"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, AlertTriangle, TrendingUp, Search, Filter } from "lucide-react"

interface Hotspot {
  id: string
  name: string
  coordinates: [number, number]
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  cases: number
  trend: "increasing" | "decreasing" | "stable"
  lastUpdated: string
  description: string
}

const mockHotspots: Hotspot[] = [
  {
    id: "1",
    name: "Lake Victoria North Shore",
    coordinates: [-0.3476, 32.5825],
    riskLevel: "Critical",
    cases: 47,
    trend: "increasing",
    lastUpdated: "2024-01-15T10:30:00Z",
    description: "High bacterial contamination detected in water samples",
  },
  {
    id: "2",
    name: "Kampala Central District",
    coordinates: [0.3476, 32.5825],
    riskLevel: "High",
    cases: 23,
    trend: "stable",
    lastUpdated: "2024-01-15T08:15:00Z",
    description: "Elevated cholera cases reported in urban area",
  },
  {
    id: "3",
    name: "Murchison Falls Region",
    coordinates: [2.2734, 31.7587],
    riskLevel: "Medium",
    cases: 12,
    trend: "decreasing",
    lastUpdated: "2024-01-14T16:45:00Z",
    description: "Water quality improving after intervention",
  },
  {
    id: "4",
    name: "Jinja Industrial Area",
    coordinates: [0.4312, 33.2042],
    riskLevel: "High",
    cases: 31,
    trend: "increasing",
    lastUpdated: "2024-01-15T12:00:00Z",
    description: "Industrial runoff affecting water sources",
  },
]

export function HotspotsMap() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")

  const filteredHotspots = mockHotspots.filter((hotspot) => {
    const matchesSearch = hotspot.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === "all" || hotspot.riskLevel.toLowerCase() === riskFilter
    return matchesSearch && matchesRisk
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
      case "stable":
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Hotspots Map
            </CardTitle>
            <CardDescription>Interactive map showing disease outbreak hotspots and risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Simplified map representation */}
            <div className="relative bg-slate-100 rounded-lg h-96 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                {/* Map markers */}
                {filteredHotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${getRiskColor(hotspot.riskLevel)} animate-pulse`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    <div
                      className={`absolute inset-0 rounded-full ${getRiskColor(hotspot.riskLevel)} opacity-30 animate-ping`}
                    />
                  </div>
                ))}

                {/* Map legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                  <h4 className="font-medium text-sm mb-2">Risk Levels</h4>
                  <div className="space-y-1">
                    {["Critical", "High", "Medium", "Low"].map((level) => (
                      <div key={level} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${getRiskColor(level)}`} />
                        <span>{level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspots List */}
      <div className="space-y-4 ">
        {/* Search and Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Hotspot Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotspots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Hotspots List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredHotspots.map((hotspot) => (
            <Card
              key={hotspot.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedHotspot?.id === hotspot.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{hotspot.name}</h3>
                  <Badge variant={hotspot.riskLevel === "Critical" ? "destructive" : "secondary"}>
                    {hotspot.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {hotspot.cases} cases
                  </span>
                  <span className="flex items-center gap-1">
                    {getTrendIcon(hotspot.trend)}
                    {hotspot.trend}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{hotspot.description}</p>
                <p className="text-xs text-gray-400">Updated: {new Date(hotspot.lastUpdated).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Hotspot Details */}
        {selectedHotspot && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hotspot Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedHotspot.name}</h4>
                  <p className="text-sm text-gray-600">{selectedHotspot.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Cases:</span>
                    <p className="font-medium">{selectedHotspot.cases}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Trend:</span>
                    <p className="font-medium capitalize">{selectedHotspot.trend}</p>
                  </div>
                </div>
                <Button size="sm" className="w-full">
                  View Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
