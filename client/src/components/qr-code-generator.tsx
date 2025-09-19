"use client"

import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  className?: string
  level?: 'L' | 'M' | 'Q' | 'H'
}

export function QRCodeGenerator({ 
  value, 
  size = 128, 
  className = '', 
  level = 'M' 
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current && value) {
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            errorCorrectionLevel: level
          })
        } catch (err) {
          console.error('Error generating QR code:', err)
        }
      }
    }

    generateQR()
  }, [value, size, level])

  if (!value) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500 text-xs">No QR</span>
      </div>
    )
  }

  return (
    <canvas 
      ref={canvasRef}
      className={`border border-gray-200 rounded ${className}`}
    />
  )
}
