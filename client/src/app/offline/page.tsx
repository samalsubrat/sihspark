'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Home, Droplets } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Droplets className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">SPARK</h1>
        </div>

        {/* Offline Icon */}
        <div className="relative mb-6">
          <WifiOff className="h-24 w-24 text-gray-400 mx-auto" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry - some features 
          of SPARK are still available offline!
        </p>

        {/* Offline Features */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Available Offline:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• View cached water quality data</li>
            <li>• Access educational content</li>
            <li>• Use water quality calculator</li>
            <li>• Browse previous reports</li>
          </ul>
        </div>

        {/* Connection Status */}
        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg mb-6 ${
          isOnline 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="font-medium">
            {isOnline ? 'Connection Restored!' : 'No Internet Connection'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={!isOnline}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isOnline
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`h-5 w-5 ${!isOnline ? '' : 'hover:rotate-180 transition-transform duration-500'}`} />
            {isOnline ? 'Reload Page' : 'Waiting for Connection...'}
          </button>

          <button
            onClick={goHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
          >
            <Home className="h-5 w-5" />
            Go to Home
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Troubleshooting Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Check your WiFi or mobile data connection</li>
            <li>• Try moving to a location with better signal</li>
            <li>• Restart your router if using WiFi</li>
            <li>• Contact your internet service provider if issues persist</li>
          </ul>
        </div>

        {/* PWA Install Promotion */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Install SPARK as an app for better offline experience and faster loading!
          </p>
        </div>
      </div>
    </div>
  )
}
