"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Activity, AlertTriangle, CheckCircle } from "lucide-react"

interface PredictionParams {
  Diarrhea: number
  Dehydration: number
  Abdominal_Pain: number
  Watery_Diarrhea: number
  Vomiting: number
  Fatigue: number
  Nausea: number
  Fever: number
  Jaundice: number
  Loss_of_Appetite: number
  Headache: number
  Muscle_Pain: number
}

interface PredictionResult {
  predicted_disease?: string
  error?: string
}

export default function WaterPredictPage() {
  const [params, setParams] = useState<PredictionParams>({
    Diarrhea: 0,
    Dehydration: 0,
    Abdominal_Pain: 0,
    Watery_Diarrhea: 0,
    Vomiting: 0,
    Fatigue: 0,
    Nausea: 0,
    Fever: 0,
    Jaundice: 0,
    Loss_of_Appetite: 0,
    Headache: 0,
    Muscle_Pain: 0,
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const symptoms = [
    { key: "Diarrhea", label: "Diarrhea", description: "Frequent loose or watery bowel movements" },
    { key: "Dehydration", label: "Dehydration", description: "Loss of body fluids and electrolytes" },
    { key: "Abdominal_Pain", label: "Abdominal Pain", description: "Pain or discomfort in the stomach area" },
    { key: "Watery_Diarrhea", label: "Watery Diarrhea", description: "Severe liquid bowel movements" },
    { key: "Vomiting", label: "Vomiting", description: "Forceful expulsion of stomach contents" },
    { key: "Fatigue", label: "Fatigue", description: "Extreme tiredness or exhaustion" },
    { key: "Nausea", label: "Nausea", description: "Feeling of sickness or urge to vomit" },
    { key: "Fever", label: "Fever", description: "Elevated body temperature" },
    { key: "Jaundice", label: "Jaundice", description: "Yellowing of skin or eyes" },
    { key: "Loss_of_Appetite", label: "Loss of Appetite", description: "Reduced desire to eat" },
    { key: "Headache", label: "Headache", description: "Pain in the head or upper neck" },
    { key: "Muscle_Pain", label: "Muscle Pain", description: "Aches or pain in muscles" },
  ]

  const handleSymptomChange = (symptom: keyof PredictionParams, checked: boolean) => {
    setParams(prev => ({
      ...prev,
      [symptom]: checked ? 1 : 0
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: PredictionResult = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while making the prediction")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setParams({
      Diarrhea: 0,
      Dehydration: 0,
      Abdominal_Pain: 0,
      Watery_Diarrhea: 0,
      Vomiting: 0,
      Fatigue: 0,
      Nausea: 0,
      Fever: 0,
      Jaundice: 0,
      Loss_of_Appetite: 0,
      Headache: 0,
      Muscle_Pain: 0,
    })
    setPrediction(null)
    setError(null)
  }

  const selectedSymptoms = Object.values(params).filter(value => value === 1).length

  const getDiseaseColor = (disease: string) => {
    const lowercaseDisease = disease.toLowerCase()
    if (lowercaseDisease.includes("cholera")) return "bg-red-100 text-red-800 border-red-200"
    if (lowercaseDisease.includes("diarrheal")) return "bg-orange-100 text-orange-800 border-orange-200"
    if (lowercaseDisease.includes("typhoid")) return "bg-purple-100 text-purple-800 border-purple-200"
    if (lowercaseDisease.includes("hepatitis")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Water-borne Disease Prediction</h1>
        <p className="text-gray-600">
          Select symptoms to predict potential water-borne diseases using AI analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Symptoms Input */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Symptom Assessment
                <Badge variant="secondary" className="ml-auto">
                  {selectedSymptoms} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {symptoms.map((symptom) => (
                  <div key={symptom.key} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-1 flex-1 mr-4">
                      <Label className="text-sm font-medium">{symptom.label}</Label>
                      <p className="text-xs text-gray-500">{symptom.description}</p>
                    </div>
                    <Switch
                      checked={params[symptom.key as keyof PredictionParams] === 1}
                      onCheckedChange={(checked: boolean) => 
                        handleSymptomChange(symptom.key as keyof PredictionParams, checked)
                      }
                      className="text-blue-600"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handlePredict} 
                  disabled={loading || selectedSymptoms === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Predict Disease
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Prediction Result */}
          {prediction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Prediction Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm text-gray-600">Predicted Disease</Label>
                    <div className={`mt-2 px-3 py-2 rounded-md border text-sm font-medium ${getDiseaseColor(prediction.predicted_disease || '')}`}>
                      {prediction.predicted_disease || 'No prediction available'}
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This prediction is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Prediction Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handlePredict}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">1</div>
                <p>Select the symptoms you are experiencing</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">2</div>
                <p>Click `&quot;`Predict Disease`&quot;` to get AI analysis</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-0.5">3</div>
                <p>Review the prediction and seek medical advice</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
