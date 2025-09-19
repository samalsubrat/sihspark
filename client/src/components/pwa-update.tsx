'use client'

import { useEffect } from 'react'

interface WindowWithWorkbox extends Window {
  workbox?: any
}

declare const window: WindowWithWorkbox

export default function PWAUpdate() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleUpdate = () => {
        const updateAvailable = confirm(
          'A new version of SPARK is available! Would you like to update now?'
        )
        
        if (updateAvailable) {
          window.location.reload()
        }
      }

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.ready
          if (registration.update) {
            await registration.update()
          }
        } catch (error) {
          console.log('Update check failed:', error)
        }
      }

      // Check for updates every 30 minutes
      const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000)

      // Initial check
      checkForUpdates()

      return () => {
        clearInterval(updateInterval)
      }
    }
  }, [])

  return null
}
