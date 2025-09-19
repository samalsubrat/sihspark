"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Calendar, 
  AlertTriangle,
  ExternalLink,
  Loader2,
  QrCode,
  RefreshCw,
  Droplets,
  TrendingUp,
  Shield
} from "lucide-react"
import { HealthCardService, type HealthCard, type ContaminationEvent } from "@/lib/health-cards"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function HealthCardPage() {
  const params = useParams()
  const waterbodyId = params.waterbodyId as string
  
  const [healthCard, setHealthCard] = useState<HealthCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealthCard = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await HealthCardService.getHealthCard(waterbodyId)
        setHealthCard(response.healthCard)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load health card'
        console.error('Error fetching health card:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (waterbodyId) {
      fetchHealthCard()
    }
  }, [waterbodyId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGoogleMapsLink = (lat?: number, lng?: number) => {
    if (!lat || !lng) return null
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  const getRiskIcon = (riskScore: number) => {
    if (riskScore <= 30) return <Shield className="w-6 h-6 text-green-600" />
    if (riskScore <= 60) return <AlertTriangle className="w-6 h-6 text-yellow-600" />
    if (riskScore <= 85) return <TrendingUp className="w-6 h-6 text-orange-600" />
    return <AlertTriangle className="w-6 h-6 text-red-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading health card...</span>
        </div>
      </div>
    )
  }

  if (error || !healthCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Health Card Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || 'The requested health card could not be found.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Waterbody Health Card</h1>
              <p className="text-sm text-gray-600">AI-powered water quality assessment</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Main Info Card */}
          <Card className="shadow-lg -py-8">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between py-2">
                <div>
                  <CardTitle className="text-2xl">{healthCard.waterbodyName}</CardTitle>
                  <p className="text-blue-100">ID: {healthCard.waterbodyId}</p>
                </div>
                <QrCode className="w-8 h-8" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Risk Score */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getRiskIcon(healthCard.riskScore)}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {healthCard.riskScore}/100
                  </div>
                  <Badge className={HealthCardService.getRiskLevelColor(healthCard.riskScore)}>
                    {HealthCardService.getRiskLevelText(healthCard.riskScore)}
                  </Badge>
                </div>

                {/* Location */}
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {healthCard.location}
                  </div>
                  {healthCard.latitude && healthCard.longitude && (
                    <a
                      href={getGoogleMapsLink(healthCard.latitude, healthCard.longitude) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on map
                    </a>
                  )}
                </div>

                {/* Last Tested */}
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 mb-1">Last Tested</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(healthCard.lastTestedDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Risk Score: {healthCard.riskScore}/100</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full ${
                        healthCard.riskScore <= 30 ? 'bg-green-500' :
                        healthCard.riskScore <= 60 ? 'bg-yellow-500' :
                        healthCard.riskScore <= 85 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthCard.riskScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    This score is calculated based on recent water test results, contamination history, 
                    and testing frequency using AI algorithms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contamination History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Contamination History ({healthCard.contaminationHistory.length} events)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthCard.contaminationHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No contamination events recorded</p>
                  <p className="text-sm">This is a good sign for water quality!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {healthCard.contaminationHistory.slice(0, 5).map((event: ContaminationEvent, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Badge className={HealthCardService.getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(event.date)}
                        </div>
                        {event.location && (
                          <div className="text-sm text-gray-600">
                            Location: {event.location}
                          </div>
                        )}
                        {event.notes && (
                          <div className="text-sm text-gray-600 mt-1">
                            {event.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {healthCard.contaminationHistory.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {healthCard.contaminationHistory.length - 5} more events
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code Access
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                <QRCodeGenerator 
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/health-card/${healthCard.waterbodyId}`}
                  size={192}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Scan this QR code to quickly access this health card on any device
              </p>
              <p className="text-xs text-gray-500 mt-2">
                URL: {typeof window !== 'undefined' ? window.location.origin : ''}/health-card/{healthCard.waterbodyId}
              </p>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="text-center text-sm text-blue-800">
                <p className="font-medium">AI-Powered Water Quality Assessment</p>
                <p>Last updated: {formatDate(healthCard.updatedAt)}</p>
                <p className="text-xs mt-2">
                  This health card is generated using artificial intelligence to analyze water test data 
                  and provide risk assessments for community safety.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
