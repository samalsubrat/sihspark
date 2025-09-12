"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Droplets, AlertTriangle, CheckCircle, Activity } from "lucide-react"
import { WaterTestsService } from "@/lib/water-tests"

interface WaterQualityParams {
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

interface WaterQualityResult {
  predicted_class: number
  probabilities: {
    "0": number
    "1": number
    "2": number
  }
}

interface NewWaterTestModalProps {
  isOpen: boolean
  onClose: () => void
  onTestCreated: () => void
}

export function NewWaterTestModal({ isOpen, onClose, onTestCreated }: NewWaterTestModalProps) {
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Water Quality Analysis
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Basic test info
  const [basicInfo, setBasicInfo] = useState({
    waterbodyName: "",
    testType: "",
    priority: "",
    conductedBy: ""
  })

  // Water quality parameters
  const [waterParams, setWaterParams] = useState<WaterQualityParams>({
    Chloramines: 0,
    Conductivity: 0,
    Hardness: 0,
    Organic_carbon: 0,
    Solids: 0,
    Sulfate: 0,
    Trihalomethanes: 0,
    Turbidity: 0,
    ph: 7.0,
  })

  // Analysis results
  const [analysisResult, setAnalysisResult] = useState<WaterQualityResult | null>(null)

  const waterParameters = [
    { key: "Chloramines", label: "Chloramines (ppm)", min: 0, max: 15, step: 0.1 },
    { key: "Conductivity", label: "Conductivity (μS/cm)", min: 0, max: 1000, step: 1 },
    { key: "Hardness", label: "Hardness (mg/L)", min: 0, max: 500, step: 1 },
    { key: "Organic_carbon", label: "Organic Carbon (ppm)", min: 0, max: 30, step: 0.1 },
    { key: "Solids", label: "Total Dissolved Solids (ppm)", min: 0, max: 50000, step: 100 },
    { key: "Sulfate", label: "Sulfate (mg/L)", min: 0, max: 500, step: 1 },
    { key: "Trihalomethanes", label: "Trihalomethanes (μg/L)", min: 0, max: 120, step: 0.1 },
    { key: "Turbidity", label: "Turbidity (NTU)", min: 0, max: 10, step: 0.1 },
    { key: "ph", label: "pH Level", min: 0, max: 14, step: 0.1 },
  ]

  const handleParameterChange = (key: keyof WaterQualityParams, value: string) => {
    const numValue = parseFloat(value) || 0
    setWaterParams(prev => ({
      ...prev,
      [key]: numValue
    }))
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)

    try {
      // Convert the capitalized field names to lowercase for the service
      const params = {
        ph: waterParams.ph,
        turbidity: waterParams.Turbidity,
        conductivity: waterParams.Conductivity,
        hardness: waterParams.Hardness,
        chloramines: waterParams.Chloramines,
        sulfate: waterParams.Sulfate,
        solids: waterParams.Solids,
        organic_carbon: waterParams.Organic_carbon,
        trihalomethanes: waterParams.Trihalomethanes
      }
      
      const result = await WaterTestsService.analyzeWaterQuality(params)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setAnalysisResult(result)
      setStep(3) // Move to results step
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTest = async () => {
    if (!analysisResult) return

    setLoading(true)
    setError(null)

    try {
      const payload = {
        waterbodyName: basicInfo.waterbodyName,
        testType: basicInfo.testType as "Surveillance" | "Routine" | "Emergency",
        priority: basicInfo.priority as "Low" | "Medium" | "High",
        conductedBy: basicInfo.conductedBy,
        waterQualityParams: waterParams,
        mlPrediction: analysisResult
      }
      
      await WaterTestsService.createWaterTest(payload)

      // Reset form and close modal
      handleReset()
      onTestCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save test")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setBasicInfo({
      waterbodyName: "",
      testType: "",
      priority: "",
      conductedBy: ""
    })
    setWaterParams({
      Chloramines: 0,
      Conductivity: 0,
      Hardness: 0,
      Organic_carbon: 0,
      Solids: 0,
      Sulfate: 0,
      Trihalomethanes: 0,
      Turbidity: 0,
      ph: 7.0,
    })
    setAnalysisResult(null)
    setError(null)
  }

  const getQualityLevel = (predictedClass: number) => {
    switch (predictedClass) {
      case 0: return { level: "Low Risk", color: "bg-green-100 text-green-800 border-green-200" }
      case 1: return { level: "Medium Risk", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      case 2: return { level: "High Risk", color: "bg-red-100 text-red-800 border-red-200" }
      default: return { level: "Unknown", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const getQualityIcon = (predictedClass: number) => {
    switch (predictedClass) {
      case 0: return <CheckCircle className="h-5 w-5 text-green-600" />
      case 1: return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 2: return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const isBasicInfoValid = basicInfo.waterbodyName && basicInfo.testType && basicInfo.priority && basicInfo.conductedBy

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            New Water Test
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Test Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterbodyName">Waterbody Name</Label>
                <Input
                  id="waterbodyName"
                  value={basicInfo.waterbodyName}
                  onChange={(e) => setBasicInfo(prev => ({ ...prev, waterbodyName: e.target.value }))}
                  placeholder="e.g., Lake Meridian"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conductedBy">Conducted By</Label>
                <Input
                  id="conductedBy"
                  value={basicInfo.conductedBy}
                  onChange={(e) => setBasicInfo(prev => ({ ...prev, conductedBy: e.target.value }))}
                  placeholder="e.g., Dr. John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select value={basicInfo.testType} onValueChange={(value) => setBasicInfo(prev => ({ ...prev, testType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="Surveillance">Surveillance</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={basicInfo.priority} onValueChange={(value) => setBasicInfo(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={!isBasicInfoValid}>
                Next: Water Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Water Quality Parameters */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Water Quality Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waterParameters.map((param) => (
                <div key={param.key} className="space-y-2">
                  <Label htmlFor={param.key}>{param.label}</Label>
                  <Input
                    id={param.key}
                    type="number"
                    value={waterParams[param.key as keyof WaterQualityParams]}
                    onChange={(e) => handleParameterChange(param.key as keyof WaterQualityParams, e.target.value)}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    placeholder={`Enter ${param.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleAnalyze} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Water Quality"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results & Save */}
        {step === 3 && analysisResult && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Analysis Results</h3>
            
            {/* Quality Assessment */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm text-gray-600">Water Quality Assessment</Label>
              <div className={`mt-2 px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-2 ${getQualityLevel(analysisResult.predicted_class).color}`}>
                {getQualityIcon(analysisResult.predicted_class)}
                {getQualityLevel(analysisResult.predicted_class).level}
              </div>
            </div>

            {/* Probability Breakdown */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Risk Assessment Breakdown</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Low Risk</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {(analysisResult.probabilities["0"] * 100).toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Medium Risk</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {(analysisResult.probabilities["1"] * 100).toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-red-50 rounded border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">High Risk</span>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {(analysisResult.probabilities["2"] * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back to Edit</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSaveTest} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Test Results"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
