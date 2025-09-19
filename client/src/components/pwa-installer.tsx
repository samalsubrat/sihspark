'use client'

import { useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function PWAInstaller() {
  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, show update notification
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Handle PWA install prompt
    let deferredPrompt: BeforeInstallPromptEvent | null = null

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
      
      // Show install button or banner
      showInstallPromotion()
    }

    const showInstallPromotion = () => {
      // Create install promotion UI
      const installBanner = document.createElement('div')
      installBanner.id = 'install-banner'
      installBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        padding: 12px 16px;
        z-index: 9999;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transform: translateY(-100%);
        transition: transform 0.3s ease;
      `
      
      installBanner.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; max-width: 400px; margin: 0 auto;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span style="font-size: 14px; font-weight: 500;">Install SPARK App</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="install-btn" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              cursor: pointer;
              font-weight: 500;
            ">Install</button>
            <button id="dismiss-btn" style="
              background: transparent;
              border: none;
              color: rgba(255,255,255,0.8);
              padding: 4px;
              cursor: pointer;
              font-size: 18px;
              line-height: 1;
            ">&times;</button>
          </div>
        </div>
      `
      
      document.body.appendChild(installBanner)
      
      // Animate in
      setTimeout(() => {
        installBanner.style.transform = 'translateY(0)'
      }, 100)
      
      // Handle install button click
      const installBtn = installBanner.querySelector('#install-btn')
      const dismissBtn = installBanner.querySelector('#dismiss-btn')
      
      installBtn?.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          const { outcome } = await deferredPrompt.userChoice
          console.log(`User response to the install prompt: ${outcome}`)
          deferredPrompt = null
          installBanner.remove()
        }
      })
      
      dismissBtn?.addEventListener('click', () => {
        installBanner.remove()
        // Store dismissal to avoid showing again for a while
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
      })
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (installBanner.parentNode) {
          installBanner.style.transform = 'translateY(-100%)'
          setTimeout(() => installBanner.remove(), 300)
        }
      }, 10000)
    }

    // Check if user hasn't dismissed recently (within 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    const shouldShow = !dismissed || (Date.now() - parseInt(dismissed)) > 7 * 24 * 60 * 60 * 1000

    if (shouldShow) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      // Hide install promotion
      const banner = document.getElementById('install-banner')
      if (banner) banner.remove()
      
      // Track install event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'pwa_installed'
        })
      }
    })

    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      console.log('App is running in standalone mode')
      // Add any standalone-specific behavior
      document.body.classList.add('pwa-standalone')
    }

    // Handle online/offline events
    const handleOnline = () => {
      console.log('App is online')
      document.body.classList.remove('pwa-offline')
      // Sync any pending data
    }

    const handleOffline = () => {
      console.log('App is offline')
      document.body.classList.add('pwa-offline')
      // Show offline indicator
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return null // This component doesn't render anything
}
