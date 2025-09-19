"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download, ExternalLink } from "lucide-react"
import { QRCodeGenerator } from "./qr-code-generator"

interface QRCodeModalProps {
  waterbodyId: string
  waterbodyName: string
  trigger?: React.ReactNode
}

export function QRCodeModal({ waterbodyId, waterbodyName, trigger }: QRCodeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Generate the URL for the health card
  const healthCardUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/health-card/${waterbodyId}`

  const handleDownloadQR = async () => {
    try {
      const QRCode = (await import('qrcode')).default
      const qrDataUrl = await QRCode.toDataURL(healthCardUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      // Create download link
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `qr-code-${waterbodyName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <QrCode className="w-4 h-4" />
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code - {waterbodyName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center p-4 bg-white rounded-lg border">
            <QRCodeGenerator 
              value={healthCardUrl}
              size={200}
              className="shadow-sm"
            />
          </div>
          
          {/* URL Display */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">QR Code URL:</p>
            <p className="text-sm font-mono break-all text-gray-800">
              {healthCardUrl}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleDownloadQR}
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(healthCardUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Card
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            Scan this QR code to quickly access the health card on any device
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
