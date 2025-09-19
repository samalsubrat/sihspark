"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  MapPin, 
  Calendar, 
  RefreshCw,
  Loader2,
  Eye,
  ExternalLink,
  AlertTriangle
} from "lucide-react"
import { HealthCardService, type HealthCard } from "@/lib/health-cards"
import { useAuth } from "@/contexts/auth-context"
import { CreateHealthCardModal } from "@/components/create-health-card-modal"
import { QRCodeModal } from "@/components/qr-code-modal"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export function HealthCardsTable() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [healthCards, setHealthCards] = useState<HealthCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)

  // Fetch health cards
  const fetchHealthCards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        setError('Please sign in to view health cards')
        return
      }
      
      const response = await HealthCardService.getHealthCards()
      setHealthCards(response.healthCards)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load health cards'
      console.error('Error fetching health cards:', err)
      setError(errorMessage)
      
      // Show demo data on error
      setHealthCards([
        {
          id: '1',
          waterbodyName: 'Central Lake',
          waterbodyId: 'wb-001',
          location: 'City Center, Sector 1',
          latitude: 28.6139,
          longitude: 77.2090,
          riskScore: 75,
          lastTestedDate: new Date(Date.now() - 86400000).toISOString(),
          contaminationHistory: [
            {
              date: new Date(Date.now() - 172800000).toISOString(),
              quality: 'high',
              location: 'North shore',
              notes: 'High bacterial contamination detected',
              severity: 'high'
            }
          ],
          qrCode: '', // QR code generated dynamically
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          waterbodyName: 'Community Well #3',
          waterbodyId: 'wb-002',
          location: 'Residential Area, Sector 5',
          riskScore: 30,
          lastTestedDate: new Date(Date.now() - 43200000).toISOString(),
          contaminationHistory: [],
          qrCode: '', // QR code generated dynamically
          createdAt: new Date(Date.now() - 1209600000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchHealthCards()
  }, [fetchHealthCards])

  // Refresh individual health card
  const handleRefreshCard = async (waterbodyId: string) => {
    try {
      setRefreshingId(waterbodyId)
      await HealthCardService.refreshHealthCard(waterbodyId)
      await fetchHealthCards() // Refresh the list
    } catch (err) {
      console.error('Error refreshing health card:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh health card')
    } finally {
      setRefreshingId(null)
    }
  }

  // Filter health cards
  const filteredHealthCards = healthCards.filter(card =>
    card.waterbodyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.waterbodyId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get Google Maps link
  const getGoogleMapsLink = (lat?: number, lng?: number) => {
    if (!lat || !lng) return null
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  const handleHealthCardCreated = () => {
    fetchHealthCards() // Refresh the list
  }

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Waterbody Health Cards
          </CardTitle>
          <CreateHealthCardModal onHealthCardCreated={handleHealthCardCreated} />
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search health cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {error && (
          <div className={`text-sm p-3 rounded-lg border ${
            error.includes('Backend not available') || error.includes('demo')
              ? 'text-blue-600 bg-blue-50 border-blue-200' 
              : 'text-red-600 bg-red-50 border-red-200'
          }`}>
            <div>{error}</div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading health cards...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waterbody</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Last Tested</TableHead>
                <TableHead>Contamination Events</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHealthCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No health cards found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredHealthCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{card.waterbodyName}</div>
                        <div className="text-sm text-gray-500">ID: {card.waterbodyId}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm">{card.location}</div>
                          {card.latitude && card.longitude && (
                            <a
                              href={getGoogleMapsLink(card.latitude, card.longitude) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View on map
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={HealthCardService.getRiskLevelColor(card.riskScore)}>
                        {card.riskScore}/100 - {HealthCardService.getRiskLevelText(card.riskScore)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(card.lastTestedDate)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {card.contaminationHistory.length} events
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QRCodeGenerator 
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/health-card/${card.waterbodyId}`}
                          size={32}
                          className="rounded"
                        />
                        <QRCodeModal 
                          waterbodyId={card.waterbodyId}
                          waterbodyName={card.waterbodyName}
                          trigger={
                            <button className="text-sm text-blue-600 hover:underline">
                              View QR
                            </button>
                          }
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/health-card/${card.waterbodyId}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefreshCard(card.waterbodyId)}
                          disabled={refreshingId === card.waterbodyId}
                        >
                          {refreshingId === card.waterbodyId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
