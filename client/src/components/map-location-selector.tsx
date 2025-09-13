'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Navigation, Loader2, Search } from 'lucide-react'

interface MapLocationSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLocationSelect: (latitude: number, longitude: number, address?: string) => void
  initialLatitude?: number
  initialLongitude?: number
}

// Declare global google object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any
    initMap: () => void
  }
}

export default function MapLocationSelector({
  open,
  onOpenChange,
  onLocationSelect,
  initialLatitude,
  initialLongitude
}: MapLocationSelectorProps) {
  const [selectedLat, setSelectedLat] = useState<number>(initialLatitude || 28.6139)
  const [selectedLng, setSelectedLng] = useState<number>(initialLongitude || 77.2090)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)

  // Load Google Maps API
  useEffect(() => {
    if (open && !window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => setMapLoaded(true)
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [open])

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedLat, lng: selectedLng },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    })

    const marker = new window.google.maps.Marker({
      position: { lat: selectedLat, lng: selectedLng },
      map: map,
      draggable: true,
      title: 'Selected Location'
    })

    // Add click listener to map
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      
      setSelectedLat(Number(lat.toFixed(6)))
      setSelectedLng(Number(lng.toFixed(6)))
      
      marker.setPosition({ lat, lng })
    })

    // Add drag listener to marker
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    marker.addListener('dragend', (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      
      setSelectedLat(Number(lat.toFixed(6)))
      setSelectedLng(Number(lng.toFixed(6)))
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }, [selectedLat, selectedLng])

  // Initialize map when loaded
  useEffect(() => {
    if (mapLoaded && open && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [mapLoaded, open, initializeMap])

  // Update marker position when coordinates change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const newPosition = { lat: selectedLat, lng: selectedLng }
      markerRef.current.setPosition(newPosition)
      mapInstanceRef.current.setCenter(newPosition)
    }
  }, [selectedLat, selectedLng])

  // Get current GPS location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      return
    }

    setLocationLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))
        
        setSelectedLat(lat)
        setSelectedLng(lng)
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        let errorMessage = 'Failed to get current location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and try again.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        
        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }, [])

  // Search for location using Google Places
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim() || !window.google) return

    setSearchLoading(true)
    
    const service = new window.google.maps.places.PlacesService(document.createElement('div'))
    
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address']
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service.textSearch(request, (results: any, status: any) => {
      setSearchLoading(false)
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const location = results[0].geometry.location
        const lat = Number(location.lat().toFixed(6))
        const lng = Number(location.lng().toFixed(6))
        
        setSelectedLat(lat)
        setSelectedLng(lng)
      } else {
        alert('Location not found. Please try a different search term.')
      }
    })
  }, [searchQuery])

  const handleConfirm = () => {
    onLocationSelect(selectedLat, selectedLng)
    onOpenChange(false)
  }

  const openInGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${selectedLat},${selectedLng}`
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search location</Label>
              <Input
                id="search"
                placeholder="Search for a location (e.g., New Delhi, India)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              />
            </div>
            <Button
              onClick={searchLocation}
              disabled={searchLoading || !searchQuery.trim() || !mapLoaded}
              variant="outline"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              variant="outline"
            >
              {locationLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Interactive Google Map */}
          <div className="relative">
            <div 
              ref={mapRef}
              className="w-full h-96 rounded-lg border bg-gray-100"
            >
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
            
            {mapLoaded && (
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600">
                💡 Click anywhere on the map or drag the marker to select location
              </div>
            )}
          </div>

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={selectedLat}
                onChange={(e) => setSelectedLat(Number(e.target.value))}
                placeholder="e.g., 28.6139"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={selectedLng}
                onChange={(e) => setSelectedLng(Number(e.target.value))}
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Selected Coordinates
                  </p>
                  <p className="text-xs text-blue-600">
                    {selectedLat}, {selectedLng}
                  </p>
                </div>
              </div>
              <Button
                onClick={openInGoogleMaps}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                Open in Maps
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!mapLoaded}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use This Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
