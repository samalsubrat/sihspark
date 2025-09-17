"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import {
  GoogleMap,
  Marker,
  HeatmapLayer,
  useJsApiLoader,
} from "@react-google-maps/api";

interface Hotspot {
  id: string;
  name: string;
  description: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
  cases?: number;
  trend?: "increasing" | "decreasing" | "stable";
  createdAt?: string;
}

export function HotspotsMap() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [zoom, setZoom] = useState(5);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const BACKEND_API_URL =
    process.env.NODE_ENV === "production"
      ? "https://sihspark.onrender.com/api/v1"
      : "http://localhost:8080/api/v1";

  // Load Google Maps API with visualization library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["visualization"],
  });

  // Fetch hotspots from backend
  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const res = await fetch(`${BACKEND_API_URL}/hotspots`);
        const data = await res.json();
        if (data.hotspots) {
          const withDefaults = data.hotspots.map((h: Hotspot) => ({
            ...h,
            riskLevel: h.riskLevel || "High",
            cases: h.cases || Math.floor(Math.random() * 50 + 1),
            trend: h.trend || "stable",
          }));
          setHotspots(withDefaults);
        }
      } catch (err) {
        console.error("Error fetching hotspots:", err);
      }
    };
    fetchHotspots();
  }, []);

  const filteredHotspots = hotspots.filter((hotspot) => {
    const matchesSearch = hotspot.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRisk =
      riskFilter === "all" || hotspot.riskLevel?.toLowerCase() === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getMarkerColor = (level?: string) => {
    switch (level) {
      case "Critical":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      case "High":
        return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      case "Medium":
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case "Low":
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      default:
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      case "stable":
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
      default:
        return null;
    }
  };

  // 🔥 Heatmap data
  const heatmapData = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return filteredHotspots
      .filter((h) => h.latitude && h.longitude)
      .map((h) => ({
        location: new window.google.maps.LatLng(h.latitude!, h.longitude!),
        weight: h.cases || 1,
      }));
  }, [filteredHotspots, isLoaded]);

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
            <CardDescription>
              Interactive map showing disease outbreak hotspots and risk levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "12px",
                }}
                center={{ lat: 20.5937, lng: 78.9629 }}
                zoom={zoom}
                onLoad={(mapInstance) => setMap(mapInstance)}
                onZoomChanged={() => {
                  if (map) {
                    setZoom(map.getZoom() || 5);
                  }
                }}
              >
                {/* Show heatmap only when zoomed OUT (≤ 7) */}
                {zoom <= 7 && heatmapData.length > 0 && (
                  <HeatmapLayer
                    data={heatmapData}
                    options={{
                      radius: 40,
                      opacity: 0.7,
                      gradient: [
                        "rgba(0, 255, 0, 0)",
                        "rgba(255, 255, 0, 1)",
                        "rgba(255, 165, 0, 1)",
                        "rgba(255, 0, 0, 1)",
                      ],
                    }}
                  />
                )}

                {/* Show markers only when zoomed IN (> 7) */}
                {zoom > 7 &&
                  filteredHotspots.map(
                    (hotspot) =>
                      hotspot.latitude &&
                      hotspot.longitude && (
                        <Marker
                          key={hotspot.id}
                          position={{
                            lat: hotspot.latitude,
                            lng: hotspot.longitude,
                          }}
                          icon={getMarkerColor(hotspot.riskLevel)}
                          onClick={() => setSelectedHotspot(hotspot)}
                        />
                      )
                  )}
              </GoogleMap>
            ) : (
              <p>Loading map...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controls + List */}
      <div className="space-y-4">
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
                  <Badge
                    variant={
                      hotspot.riskLevel === "Critical"
                        ? "destructive"
                        : "secondary"
                    }
                  >
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
                <p className="text-xs text-gray-500 mb-2">
                  {hotspot.description}
                </p>
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
                  <p className="text-sm text-gray-600">
                    {selectedHotspot.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Cases:</span>
                    <p className="font-medium">{selectedHotspot.cases}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Trend:</span>
                    <p className="font-medium capitalize">
                      {selectedHotspot.trend}
                    </p>
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
  );
}
