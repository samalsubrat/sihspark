"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { HealthCardService, type CreateHealthCardPayload } from "@/lib/health-cards"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Loader2, MapPin, Target } from "lucide-react"

interface CreateHealthCardModalProps {
  onHealthCardCreated: () => void
}

export function CreateHealthCardModal({ onHealthCardCreated }: CreateHealthCardModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateHealthCardPayload>({
    waterbodyName: "",
    waterbodyId: "",
    location: "",
    latitude: undefined,
    longitude: undefined
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.waterbodyName.trim() || !formData.location.trim()) {
      setError("Waterbody name and location are required")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload: CreateHealthCardPayload = {
        waterbodyName: formData.waterbodyName.trim(),
        location: formData.location.trim(),
        ...(formData.waterbodyId && formData.waterbodyId.trim() && { waterbodyId: formData.waterbodyId.trim() }),
        ...(formData.latitude && { latitude: formData.latitude }),
        ...(formData.longitude && { longitude: formData.longitude })
      }

      await HealthCardService.createHealthCard(payload)
      
      // Reset form
      setFormData({
        waterbodyName: "",
        waterbodyId: "",
        location: "",
        latitude: undefined,
        longitude: undefined
      })
      
      setOpen(false)
      onHealthCardCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create health card")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateHealthCardPayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'latitude' || field === 'longitude' 
        ? (value === '' ? undefined : parseFloat(value))
        : value
    }))
  }

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }))
      },
      (error) => {
        console.error("Error getting location:", error)
        setError("Failed to get current location")
      }
    )
  }

  // Check if user can create health cards
  if (!user || !["admin", "leader", "asha"].includes(user.role || "")) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Health Card
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Waterbody Health Card</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm p-3 rounded-lg border border-red-200 bg-red-50 text-red-600">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="waterbodyName">Waterbody Name *</Label>
            <Input
              id="waterbodyName"
              placeholder="e.g., Central Lake, Community Well #3"
              value={formData.waterbodyName}
              onChange={(e) => handleInputChange('waterbodyName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="waterbodyId">Waterbody ID (Optional)</Label>
            <Input
              id="waterbodyId"
              placeholder="Leave empty to auto-generate"
              value={formData.waterbodyId}
              onChange={(e) => handleInputChange('waterbodyId', e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Unique identifier for this waterbody. If not provided, one will be generated automatically.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g., City Center, Sector 1"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>
          
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Coordinates (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Get Current Location
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="28.6139"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="77.2090"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                  />
                </div>
              </div>
              
              {formData.latitude && formData.longitude && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <a
                    href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Health Card
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
