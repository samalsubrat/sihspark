"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ReportsService, type CreateReportPayload } from "@/lib/reports"
import { UploadButton } from "@/lib/uploadthing"
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
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, MapPin, Calendar, Loader2, Upload, CheckCircle } from "lucide-react"

interface CreateReportModalProps {
  onReportCreated: () => void
}

export function CreateReportModal({ onReportCreated }: CreateReportModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    mapArea: '',
    photoUrl: '',
    comment: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Report name is required'
    }
    
    if (!formData.location.trim() && (!formData.latitude || !formData.longitude)) {
      newErrors.location = 'Either location name or coordinates are required'
    }
    
    if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      newErrors.latitude = 'Valid latitude between -90 and 90 is required'
    }
    
    if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      newErrors.longitude = 'Valid longitude between -180 and 180 is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    if (!user?.id) {
      setErrors({ general: 'User authentication required' })
      return
    }

    setLoading(true)
    
    try {
      const payload: CreateReportPayload = {
        name: formData.name.trim(),
        location: formData.location.trim() || undefined,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        date: new Date(formData.date).toISOString(),
        mapArea: formData.mapArea.trim() || undefined,
        leaderId: user.id,
        photoUrl: formData.photoUrl || undefined,
        comment: formData.comment.trim() || undefined
      }

      await ReportsService.createReport(payload)
      
      // Reset form
      setFormData({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        date: new Date().toISOString().split('T')[0],
        mapArea: '',
        photoUrl: '',
        comment: ''
      })
      setUploadStatus('idle')
      setErrors({})
      setOpen(false)
      
      // Refresh the reports list
      onReportCreated()
      
    } catch (error) {
      console.error('Error creating report:', error)
      setErrors({ 
        general: error instanceof Error ? error.message : 'Failed to create report' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      date: new Date().toISOString().split('T')[0],
      mapArea: '',
      photoUrl: '',
      comment: ''
    })
    setUploadStatus('idle')
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.general}
            </div>
          )}
          
          {/* Report Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Report Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Water Quality Report - Lake District"
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Information
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm">Location Name</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Lake District, Area A"
                  className={errors.location ? 'border-red-300' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapArea" className="text-sm">Map Area</Label>
                <Input
                  id="mapArea"
                  value={formData.mapArea}
                  onChange={(e) => handleInputChange('mapArea', e.target.value)}
                  placeholder="e.g., Sector 5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="e.g., 28.6139"
                  className={errors.latitude ? 'border-red-300' : ''}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-600">{errors.latitude}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="e.g., 77.2090"
                  className={errors.longitude ? 'border-red-300' : ''}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-600">{errors.longitude}</p>
                )}
              </div>
            </div>
            
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-red-300' : ''}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4 text-black" />
              Photo Upload
            </Label>
            
            {formData.photoUrl ? (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600">Photo uploaded successfully!</p>
                    {/* <p className="text-xs text-gray-500 truncate">{formData.photoUrl}</p> */}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-4">
                <div className="text-center">
                  {uploadStatus === 'uploading' ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Uploading image...</span>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res[0]) {
                          setFormData(prev => ({ ...prev, photoUrl: res[0].url }))
                          setUploadStatus('success')
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error('Upload error:', error)
                        setUploadStatus('error')
                        setErrors(prev => ({ ...prev, upload: `Upload failed: ${error.message}` }))
                      }}
                      onUploadBegin={() => {
                        setUploadStatus('uploading')
                        if (errors.upload) {
                          setErrors(prev => ({ ...prev, upload: '' }))
                        }
                      }}
                    />
                  )}
                  
                  {uploadStatus === 'error' && errors.upload && (
                    <p className="text-sm text-red-600 mt-2">{errors.upload}</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a photo related to this water quality report (max 4MB)
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Additional Comments
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Describe the water quality issues, concerns, or observations..."
              rows={4}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || uploadStatus === 'uploading'}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
