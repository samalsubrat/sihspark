'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { WaterTestsService } from '@/lib/water-tests'
import { UploadButton } from '@/lib/uploadthing'
import { Card } from './ui/card'
import { CheckCircle, Upload, Loader2 } from 'lucide-react'

interface CreateWaterTestModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

interface WaterTestFormData {
    waterbodyName: string
    testType: "Surveillance" | "Routine" | "Emergency"
    priority: "Low" | "Medium" | "High"
    conductedBy: string
    dateTime: string
    location: string
    latitude: number
    longitude: number
    photoUrl: string
    notes: string
    waterQualityParams: {
        Chloramines: number
        Conductivity: number
        Hardness: number
        Organic_carbon: number
        Solids: number
        Sulfate: number
        Trihalomethanes: number
        Turbidity: number
        ph: number
    }
}

export default function CreateWaterTestModal({ open, onOpenChange, onSuccess }: CreateWaterTestModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState<WaterTestFormData>({
        waterbodyName: '',
        testType: 'Routine',
        priority: 'Medium',
        conductedBy: '',
        dateTime: new Date().toISOString().slice(0, 16),
        location: '',
        latitude: 0,
        longitude: 0,
        photoUrl: '',
        notes: '',
        waterQualityParams: {
            Chloramines: 0,
            Conductivity: 0,
            Hardness: 0,
            Organic_carbon: 0,
            Solids: 0,
            Sulfate: 0,
            Trihalomethanes: 0,
            Turbidity: 0,
            ph: 7,
        }
    })

    const handleInputChange = (field: string, value: string | number) => {
        if (field.startsWith('waterQualityParams.')) {
            const paramName = field.split('.')[1]
            setFormData(prev => ({
                ...prev,
                waterQualityParams: {
                    ...prev.waterQualityParams,
                    [paramName]: parseFloat(value.toString()) || 0
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }))
        }
    }

    const handleAnalyzeQuality = async () => {
        setAnalyzing(true)
        try {
            const analysis = await WaterTestsService.analyzeWaterQuality({
                ph: formData.waterQualityParams.ph,
                turbidity: formData.waterQualityParams.Turbidity,
                conductivity: formData.waterQualityParams.Conductivity,
                hardness: formData.waterQualityParams.Hardness,
                chloramines: formData.waterQualityParams.Chloramines,
                sulfate: formData.waterQualityParams.Sulfate,
                solids: formData.waterQualityParams.Solids,
                organic_carbon: formData.waterQualityParams.Organic_carbon,
                trihalomethanes: formData.waterQualityParams.Trihalomethanes,
            })

            toast({
                title: "Analysis Complete",
                description: `Water Quality: ${analysis.quality} (Confidence: ${(analysis.confidence * 100).toFixed(1)}%)`,
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Analysis Failed",
                description: "Failed to analyze water quality. Please try again.",
                variant: "destructive",
            })
        } finally {
            setAnalyzing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Get ML prediction first
            const mlPrediction = await WaterTestsService.analyzeWaterQuality({
                ph: formData.waterQualityParams.ph,
                turbidity: formData.waterQualityParams.Turbidity,
                conductivity: formData.waterQualityParams.Conductivity,
                hardness: formData.waterQualityParams.Hardness,
                chloramines: formData.waterQualityParams.Chloramines,
                sulfate: formData.waterQualityParams.Sulfate,
                solids: formData.waterQualityParams.Solids,
                organic_carbon: formData.waterQualityParams.Organic_carbon,
                trihalomethanes: formData.waterQualityParams.Trihalomethanes,
            })

            // Create water test with ML prediction
            const payload = {
                waterbodyName: formData.waterbodyName,
                testType: formData.testType,
                priority: formData.priority,
                conductedBy: formData.conductedBy,
                dateTime: formData.dateTime,
                location: formData.location,
                latitude: formData.latitude,
                longitude: formData.longitude,
                photoUrl: formData.photoUrl,
                notes: formData.notes,
                waterQualityParams: formData.waterQualityParams,
                mlPrediction: {
                    predicted_class: mlPrediction.predicted_class,
                    probabilities: mlPrediction.probabilities
                }
            }

            await WaterTestsService.createWaterTest(payload)

            toast({
                title: "Success",
                description: "Water test created successfully",
            })

            onSuccess()
            onOpenChange(false)

            // Reset form
            setFormData({
                waterbodyName: '',
                testType: 'Routine',
                priority: 'Medium',
                conductedBy: '',
                dateTime: new Date().toISOString().slice(0, 16),
                location: '',
                latitude: 0,
                longitude: 0,
                photoUrl: '',
                notes: '',
                waterQualityParams: {
                    Chloramines: 0,
                    Conductivity: 0,
                    Hardness: 0,
                    Organic_carbon: 0,
                    Solids: 0,
                    Sulfate: 0,
                    Trihalomethanes: 0,
                    Turbidity: 0,
                    ph: 7,
                }
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create water test",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Water Test</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="waterbodyName">Waterbody Name</Label>
                            <Input
                                id="waterbodyName"
                                value={formData.waterbodyName}
                                onChange={(e) => handleInputChange('waterbodyName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="conductedBy">Conducted By</Label>
                            <Input
                                id="conductedBy"
                                value={formData.conductedBy}
                                onChange={(e) => handleInputChange('conductedBy', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="testType">Test Type</Label>
                            <Select value={formData.testType} onValueChange={(value) => handleInputChange('testType', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Surveillance">Surveillance</SelectItem>
                                    <SelectItem value="Routine">Routine</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateTime">Date & Time</Label>
                            <Input
                                id="dateTime"
                                type="datetime-local"
                                value={formData.dateTime}
                                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                            />
                        </div>
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

                    {/* Water Quality Parameters */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Water Quality Parameters</Label>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAnalyzeQuality}
                                disabled={analyzing}
                            >
                                {analyzing ? 'Analyzing...' : 'Analyze Quality'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ph">pH</Label>
                                <Input
                                    id="ph"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    value={formData.waterQualityParams.ph}
                                    onChange={(e) => handleInputChange('waterQualityParams.ph', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="turbidity">Turbidity</Label>
                                <Input
                                    id="turbidity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Turbidity}
                                    onChange={(e) => handleInputChange('waterQualityParams.Turbidity', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="conductivity">Conductivity</Label>
                                <Input
                                    id="conductivity"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Conductivity}
                                    onChange={(e) => handleInputChange('waterQualityParams.Conductivity', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hardness">Hardness</Label>
                                <Input
                                    id="hardness"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Hardness}
                                    onChange={(e) => handleInputChange('waterQualityParams.Hardness', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="chloramines">Chloramines</Label>
                                <Input
                                    id="chloramines"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Chloramines}
                                    onChange={(e) => handleInputChange('waterQualityParams.Chloramines', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sulfate">Sulfate</Label>
                                <Input
                                    id="sulfate"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Sulfate}
                                    onChange={(e) => handleInputChange('waterQualityParams.Sulfate', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="solids">Total Dissolved Solids</Label>
                                <Input
                                    id="solids"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Solids}
                                    onChange={(e) => handleInputChange('waterQualityParams.Solids', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organic_carbon">Organic Carbon</Label>
                                <Input
                                    id="organic_carbon"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Organic_carbon}
                                    onChange={(e) => handleInputChange('waterQualityParams.Organic_carbon', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trihalomethanes">Trihalomethanes</Label>
                                <Input
                                    id="trihalomethanes"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.waterQualityParams.Trihalomethanes}
                                    onChange={(e) => handleInputChange('waterQualityParams.Trihalomethanes', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Water Test'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
