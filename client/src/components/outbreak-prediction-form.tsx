"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Loader2, 
  TrendingUp,
  Droplets,
  Thermometer,
  Users,
  MapPin,
  Calendar,
  Activity
} from "lucide-react"
import { 
  OutbreakPredictionService, 
  type OutbreakPredictionInput, 
  type OutbreakPredictionOutput 
} from "@/lib/outbreak-prediction"

interface OutbreakPredictionFormProps {
  onPrediction?: (prediction: OutbreakPredictionOutput) => void
}

export function OutbreakPredictionForm({ onPrediction }: OutbreakPredictionFormProps) {
  const [formData, setFormData] = useState<OutbreakPredictionInput>({
    reported_cases: 100,
    turbidity_ntu: 8.5,
    ph_level: 7.2,
    rainfall_mm: 10.0,
    e_coli_present: 1,
    population_density: 1200,
    proximity_to_river: 3,
    cases_7_day_avg: 100,
    rainfall_3_day_sum: 30.0,
    cases_7_days_ago: 48
  })
  
  const [prediction, setPrediction] = useState<OutbreakPredictionOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof OutbreakPredictionInput, value: string) => {
    const numericValue = field === 'e_coli_present' 
      ? (value === '1' || value === 'true' ? 1 : 0)
      : parseFloat(value) || 0
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await OutbreakPredictionService.predictOutbreak(formData)
      setPrediction(response.prediction)
      onPrediction?.(response.prediction)
      
      // Show demo message if it's a fallback response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((response as any).isDemo) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (response as any).message || 'Using demo prediction based on your inputs'
        setError(message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to predict outbreak risk'
      console.error('Error predicting outbreak:', err)
      
      // Check if it's a service unavailable error and provide helpful message
      if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
        setError('The AI prediction model is temporarily overloaded. Please try again in a few moments, or use the demo prediction shown below.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputFields = [
    {
      key: 'reported_cases' as const,
      label: 'Reported Cases',
      icon: Activity,
      description: 'Current number of reported cases',
      type: 'number',
      min: 0
    },
    {
      key: 'turbidity_ntu' as const,
      label: 'Turbidity (NTU)',
      icon: Droplets,
      description: 'Water turbidity level in Nephelometric Turbidity Units',
      type: 'number',
      min: 0,
      step: 0.1
    },
    {
      key: 'ph_level' as const,
      label: 'pH Level',
      icon: Thermometer,
      description: 'Water pH level (0-14 scale)',
      type: 'number',
      min: 0,
      max: 14,
      step: 0.1
    },
    {
      key: 'rainfall_mm' as const,
      label: 'Rainfall (mm)',
      icon: Calendar,
      description: 'Recent rainfall in millimeters',
      type: 'number',
      min: 0,
      step: 0.1
    },
    {
      key: 'population_density' as const,
      label: 'Population Density',
      icon: Users,
      description: 'People per square kilometer',
      type: 'number',
      min: 0
    },
    {
      key: 'proximity_to_river' as const,
      label: 'Proximity to River (km)',
      icon: MapPin,
      description: 'Distance to nearest river in kilometers',
      type: 'number',
      min: 0,
      step: 0.1
    },
    {
      key: 'cases_7_day_avg' as const,
      label: '7-Day Average Cases',
      icon: TrendingUp,
      description: 'Average daily cases over last 7 days',
      type: 'number',
      min: 0
    },
    {
      key: 'rainfall_3_day_sum' as const,
      label: '3-Day Rainfall Sum (mm)',
      icon: Calendar,
      description: 'Total rainfall over last 3 days',
      type: 'number',
      min: 0,
      step: 0.1
    },
    {
      key: 'cases_7_days_ago' as const,
      label: 'Cases 7 Days Ago',
      icon: Activity,
      description: 'Number of cases exactly 7 days ago',
      type: 'number',
      min: 0
    }
  ]

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Outbreak Risk Prediction
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter environmental and epidemiological data to predict outbreak risk probability
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* E. coli Presence Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Droplets className="w-4 h-4" />
                E. coli Presence
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="e_coli_present"
                    value="1"
                    checked={formData.e_coli_present === 1}
                    onChange={(e) => handleInputChange('e_coli_present', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Present</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="e_coli_present"
                    value="0"
                    checked={formData.e_coli_present === 0}
                    onChange={(e) => handleInputChange('e_coli_present', e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Not Present</span>
                </label>
              </div>
            </div>

            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inputFields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="w-4 h-4" />
                      {field.label}
                    </Label>
                    <Input
                      type={field.type}
                      value={formData[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">{field.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Predict Outbreak Risk
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className={
          error.includes('demo') || error.includes('Demo') || error.includes('temporarily unavailable') || error.includes('calculated demo prediction')
            ? "border-blue-200 bg-blue-50"
            : error.includes('overloaded') || error.includes('try again')
            ? "border-yellow-200 bg-yellow-50"
            : "border-red-200 bg-red-50"
        }>
          <CardContent className="p-4">
            <div className={`flex items-center gap-2 ${
              error.includes('demo') || error.includes('Demo') || error.includes('temporarily unavailable') || error.includes('calculated demo prediction')
                ? "text-blue-800"
                : error.includes('overloaded') || error.includes('try again')
                ? "text-yellow-800"
                : "text-red-800"
            }`}>
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                {error.includes('demo') || error.includes('Demo') || error.includes('temporarily unavailable') || error.includes('calculated demo prediction')
                  ? 'Demo Mode'
                  : error.includes('overloaded') || error.includes('try again')
                  ? 'Service Notice'
                  : 'Prediction Error'
                }
              </span>
            </div>
            <p className={`text-sm mt-2 ${
              error.includes('demo') || error.includes('Demo') || error.includes('temporarily unavailable') || error.includes('calculated demo prediction')
                ? "text-blue-700"
                : error.includes('overloaded') || error.includes('try again')
                ? "text-yellow-700"
                : "text-red-700"
            }`}>
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Prediction Result */}
      {prediction && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="w-5 h-5" />
              Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-900 mb-2">
                  {(prediction.outbreak_risk_probability * 100).toFixed(1)}%
                </div>
                <Badge className={OutbreakPredictionService.getRiskLevelColor(prediction.outbreak_risk_probability)}>
                  {OutbreakPredictionService.getRiskLevelText(prediction.outbreak_risk_probability)}
                </Badge>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">Prediction Generated</div>
                <div className="text-sm font-medium">
                  {OutbreakPredictionService.formatTimestamp(prediction.timestamp)}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">Risk Assessment</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      prediction.outbreak_risk_probability <= 0.25 ? 'bg-green-500' :
                      prediction.outbreak_risk_probability <= 0.5 ? 'bg-yellow-500' :
                      prediction.outbreak_risk_probability <= 0.75 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${prediction.outbreak_risk_probability * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
