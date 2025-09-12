"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Droplets, AlertTriangle, CheckCircle, Activity } from "lucide-react"

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
  predicted_class?: number
  probabilities?: {
    "0": number
    "1": number
    "2": number
  }
  error?: string
}

export default function WaterQualityTestPage() {
  const [params, setParams] = useState<WaterQualityParams>({
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

  const [prediction, setPrediction] = useState<WaterQualityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const waterParameters = [
    { 
      key: "Chloramines", 
      label: "Chloramines (ppm)", 
      description: "Chemical disinfectant levels",
      min: 0,
      max: 15,
      step: 0.1,
      unit: "ppm"
    },
    { 
      key: "Conductivity", 
      label: "Conductivity (μS/cm)", 
      description: "Electrical conductivity of water",
      min: 0,
      max: 1000,
      step: 1,
      unit: "μS/cm"
    },
    { 
      key: "Hardness", 
      label: "Hardness (mg/L)", 
      description: "Calcium and magnesium content",
      min: 0,
      max: 500,
      step: 1,
      unit: "mg/L"
    },
    { 
      key: "Organic_carbon", 
      label: "Organic Carbon (ppm)", 
      description: "Total organic carbon content",
      min: 0,
      max: 30,
      step: 0.1,
      unit: "ppm"
    },
    { 
      key: "Solids", 
      label: "Total Dissolved Solids (ppm)", 
      description: "Total dissolved solid particles",
      min: 0,
      max: 50000,
      step: 100,
      unit: "ppm"
    },
    { 
      key: "Sulfate", 
      label: "Sulfate (mg/L)", 
      description: "Sulfate ion concentration",
      min: 0,
      max: 500,
      step: 1,
      unit: "mg/L"
    },
    { 
      key: "Trihalomethanes", 
      label: "Trihalomethanes (μg/L)", 
      description: "Disinfection byproducts",
      min: 0,
      max: 120,
      step: 0.1,
      unit: "μg/L"
    },
    { 
      key: "Turbidity", 
      label: "Turbidity (NTU)", 
      description: "Water clarity measurement",
      min: 0,
      max: 10,
      step: 0.1,
      unit: "NTU"
    },
    { 
      key: "ph", 
      label: "pH Level", 
      description: "Acidity/alkalinity of water",
      min: 0,
      max: 14,
      step: 0.1,
      unit: ""
    },
  ]

  const handleParameterChange = (key: keyof WaterQualityParams, value: string) => {
    const numValue = parseFloat(value) || 0
    setParams(prev => ({
      ...prev,
      [key]: numValue
    }))
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/water-quality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: WaterQualityResult = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing water quality")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setParams({
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
    setPrediction(null)
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          Water Quality Analysis
        </h1>
        <p className="text-gray-600">
          Enter water test parameters to get AI-powered quality assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Water Test Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {waterParameters.map((param) => (
                <div key={param.key} className="space-y-2">
                  <Label htmlFor={param.key} className="text-sm font-medium">
                    {param.label}
                  </Label>
                  <Input
                    id={param.key}
                    type="number"
                    value={params[param.key as keyof WaterQualityParams]}
                    onChange={(e) => handleParameterChange(param.key as keyof WaterQualityParams, e.target.value)}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    className="w-full"
                    placeholder={`Enter ${param.label.toLowerCase()}`}
                  />
                  <p className="text-xs text-gray-500">{param.description}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Droplets className="mr-2 h-4 w-4" />
                    Analyze Water Quality
                  </>
                )}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline"
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Analysis Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {prediction && prediction.predicted_class !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getQualityIcon(prediction.predicted_class)}
                  Water Quality Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Quality Level */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Overall Quality Assessment</Label>
                    <div className={`mt-2 px-3 py-2 rounded-md border text-sm font-medium flex items-center gap-2 ${getQualityLevel(prediction.predicted_class).color}`}>
                      {getQualityIcon(prediction.predicted_class)}
                      {getQualityLevel(prediction.predicted_class).level}
                    </div>
                  </div>

                  {/* Probability Breakdown */}
                  {prediction.probabilities && (
                    <div className="space-y-3">
                      <Label className="text-sm text-gray-600">Risk Assessment Breakdown</Label>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Low Risk</span>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {(prediction.probabilities["0"] * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">Medium Risk</span>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {(prediction.probabilities["1"] * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded border">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium">High Risk</span>
                          </div>
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            {(prediction.probabilities["2"] * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This analysis is for informational purposes only. For critical decisions, please consult certified water quality testing laboratories.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Enter the measured values for each water quality parameter</p>
                <p>• Ensure all values are within acceptable ranges</p>
                <p>• Click &quot;Analyze Water Quality&quot; to get AI-powered assessment</p>
                <p>• Review the risk level and probability breakdown</p>
                <p>• Use &quot;Reset&quot; to clear all values and start over</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
