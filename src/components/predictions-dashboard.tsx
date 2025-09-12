"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, AlertTriangle, Activity, Brain, Target } from "lucide-react"

interface Prediction {
  id: string
  type: "outbreak_risk" | "water_quality" | "disease_spread" | "contamination"
  title: string
  confidence: number
  prediction: string
  risk_level: "low" | "medium" | "high" | "critical"
  last_updated: string
  model_version: string
}

const mockPredictions: Prediction[] = [
  {
    id: "pred-001",
    type: "outbreak_risk",
    title: "Gastrointestinal Outbreak Risk",
    confidence: 78,
    prediction: "Medium risk in downtown area within 7 days",
    risk_level: "medium",
    last_updated: "2024-01-15 14:30",
    model_version: "v2.1.3",
  },
  {
    id: "pred-002",
    type: "water_quality",
    title: "Lake Meridian Water Quality Trend",
    confidence: 92,
    prediction: "Declining quality, intervention recommended",
    risk_level: "high",
    last_updated: "2024-01-15 12:15",
    model_version: "v1.8.2",
  },
  {
    id: "pred-003",
    type: "disease_spread",
    title: "Cryptosporidium Spread Pattern",
    confidence: 65,
    prediction: "Potential spread to adjacent watersheds",
    risk_level: "medium",
    last_updated: "2024-01-15 10:45",
    model_version: "v3.0.1",
  },
]

const outbreakRiskData = [
  { date: "Jan 8", risk: 15, confidence: 85 },
  { date: "Jan 9", risk: 22, confidence: 78 },
  { date: "Jan 10", risk: 35, confidence: 82 },
  { date: "Jan 11", risk: 45, confidence: 75 },
  { date: "Jan 12", risk: 52, confidence: 80 },
  { date: "Jan 13", risk: 48, confidence: 85 },
  { date: "Jan 14", risk: 55, confidence: 78 },
  { date: "Jan 15", risk: 62, confidence: 78 },
]

const waterQualityForecast = [
  { date: "Jan 15", ph: 7.2, bacteria: 450, turbidity: 4.2 },
  { date: "Jan 16", ph: 7.0, bacteria: 520, turbidity: 4.8 },
  { date: "Jan 17", ph: 6.8, bacteria: 680, turbidity: 5.5 },
  { date: "Jan 18", ph: 6.6, bacteria: 820, turbidity: 6.2 },
  { date: "Jan 19", ph: 6.4, bacteria: 950, turbidity: 7.1 },
  { date: "Jan 20", ph: 6.2, bacteria: 1100, turbidity: 8.0 },
  { date: "Jan 21", ph: 6.0, bacteria: 1250, turbidity: 8.8 },
]

function getRiskColor(risk_level: Prediction["risk_level"]) {
  switch (risk_level) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getRiskIcon(risk_level: Prediction["risk_level"]) {
  switch (risk_level) {
    case "critical":
    case "high":
      return <AlertTriangle className="w-4 h-4 text-red-600" />
    case "medium":
      return <TrendingUp className="w-4 h-4 text-yellow-600" />
    case "low":
      return <Activity className="w-4 h-4 text-green-600" />
    default:
      return <Target className="w-4 h-4 text-gray-600" />
  }
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">{prediction.title}</CardTitle>
          </div>
          <Badge className={getRiskColor(prediction.risk_level)}>{prediction.risk_level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          {getRiskIcon(prediction.risk_level)}
          <p className="text-sm text-gray-700">{prediction.prediction}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Confidence Level</span>
            <span className="font-medium text-gray-900">{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Model: {prediction.model_version}</span>
          <span>Updated: {prediction.last_updated}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function PredictionsDashboard() {
  return (
    <div className="space-y-6">
      {/* Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPredictions.map((prediction) => (
          <PredictionCard key={prediction.id} prediction={prediction} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outbreak Risk Trend */}
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Outbreak Risk Trend</CardTitle>
            <p className="text-sm text-gray-600">7-day risk assessment with confidence intervals</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={outbreakRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#fef2f2" strokeWidth={2} />
                <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={1} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Water Quality Forecast */}
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Water Quality Forecast</CardTitle>
            <p className="text-sm text-gray-600">7-day prediction for Lake Meridian</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterQualityForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="bacteria" stroke="#ef4444" strokeWidth={2} name="Bacteria (CFU/100ml)" />
                <Line type="monotone" dataKey="turbidity" stroke="#f59e0b" strokeWidth={2} name="Turbidity (NTU)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <Card className="rounded-xl border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Model Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">87.5%</div>
              <div className="text-sm text-gray-600">Outbreak Prediction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">91.8%</div>
              <div className="text-sm text-gray-600">Water Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">83.3%</div>
              <div className="text-sm text-gray-600">Disease Spread</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
