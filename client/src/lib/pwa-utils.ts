// PWA utility functions for SPARK

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export interface PWADisplayMode {
  isStandalone: boolean
  isFullscreen: boolean
  isMinimalUI: boolean
  isBrowser: boolean
}

export class PWAUtils {
  private static deferredPrompt: BeforeInstallPromptEvent | null = null

  /**
   * Check if the app is running as a PWA (standalone mode)
   */
  static isPWA(): boolean {
    if (typeof window === 'undefined') return false
    
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // @ts-expect-error - navigator.standalone is iOS specific
      window.navigator.standalone === true
    )
  }

  /**
   * Get the current display mode
   */
  static getDisplayMode(): PWADisplayMode {
    if (typeof window === 'undefined') {
      return {
        isStandalone: false,
        isFullscreen: false,
        isMinimalUI: false,
        isBrowser: true
      }
    }

    return {
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
      isMinimalUI: window.matchMedia('(display-mode: minimal-ui)').matches,
      isBrowser: window.matchMedia('(display-mode: browser)').matches
    }
  }

  /**
   * Check if PWA installation is available
   */
  static canInstall(): boolean {
    return this.deferredPrompt !== null
  }

  /**
   * Set the deferred install prompt
   */
  static setDeferredPrompt(event: BeforeInstallPromptEvent) {
    this.deferredPrompt = event
  }

  /**
   * Trigger PWA installation
   */
  static async install(): Promise<{ outcome: string; platform: string } | null> {
    if (!this.deferredPrompt) {
      console.warn('PWA install prompt not available')
      return null
    }

    try {
      this.deferredPrompt.prompt()
      const result = await this.deferredPrompt.userChoice
      this.deferredPrompt = null
      return result
    } catch (error) {
      console.error('PWA installation failed:', error)
      return null
    }
  }

  /**
   * Register service worker
   */
  static async registerServiceWorker(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath)
      console.log('Service Worker registered:', registration)
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              this.notifyUpdate()
            }
          })
        }
      })

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }

  /**
   * Notify user of available update
   */
  private static notifyUpdate() {
    if (typeof window === 'undefined') return

    const event = new CustomEvent('pwa-update-available', {
      detail: {
        message: 'A new version of SPARK is available!'
      }
    })
    window.dispatchEvent(event)
  }

  /**
   * Check for service worker updates
   */
  static async checkForUpdates(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      if (registration.update) {
        await registration.update()
        return true
      }
      return false
    } catch (error) {
      console.error('Update check failed:', error)
      return false
    }
  }

  /**
   * Get network status
   */
  static getNetworkStatus(): { online: boolean; effectiveType?: string; downlink?: number } {
    if (typeof window === 'undefined') {
      return { online: true }
    }

    // @ts-expect-error - Network Information API types are not available in all browsers
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink
    }
  }

  /**
   * Listen for network changes
   */
  static onNetworkChange(callback: (online: boolean) => void) {
    if (typeof window === 'undefined') return () => {}

    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  /**
   * Cache critical resources
   */
  static async cacheResources(urls: string[]): Promise<boolean> {
    if (!('caches' in window)) {
      console.warn('Cache API not supported')
      return false
    }

    try {
      const cache = await caches.open('spark-critical-v1')
      await cache.addAll(urls)
      console.log('Critical resources cached')
      return true
    } catch (error) {
      console.error('Failed to cache resources:', error)
      return false
    }
  }

  /**
   * Clear all caches
   */
  static async clearCaches(): Promise<boolean> {
    if (!('caches' in window)) {
      return false
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('All caches cleared')
      return true
    } catch (error) {
      console.error('Failed to clear caches:', error)
      return false
    }
  }

  /**
   * Get cache usage information
   */
  static async getCacheUsage(): Promise<{ used: number; total: number } | null> {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return null
    }

    try {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        total: estimate.quota || 0
      }
    } catch (error) {
      console.error('Failed to get cache usage:', error)
      return null
    }
  }

  /**
   * Request persistent storage
   */
  static async requestPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator) || !('persist' in navigator.storage)) {
      return false
    }

    try {
      const persistent = await navigator.storage.persist()
      console.log('Persistent storage:', persistent)
      return persistent
    } catch (error) {
      console.error('Failed to request persistent storage:', error)
      return false
    }
  }

  /**
   * Share content using Web Share API
   */
  static async share(data: ShareData): Promise<boolean> {
    if (!('share' in navigator)) {
      // Fallback to clipboard or other sharing methods
      this.fallbackShare(data)
      return false
    }

    try {
      await navigator.share(data)
      return true
    } catch (error) {
      console.error('Web Share failed:', error)
      this.fallbackShare(data)
      return false
    }
  }

  /**
   * Fallback sharing method
   */
  private static fallbackShare(data: ShareData) {
    const shareText = `${data.title || ''}\n${data.text || ''}\n${data.url || ''}`
    
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Content copied to clipboard')
      }).catch(error => {
        console.error('Clipboard write failed:', error)
      })
    }
  }

  /**
   * Add to home screen prompt handling
   */
  static handleBeforeInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Dispatch custom event for app to handle
      const event = new CustomEvent('pwa-install-available')
      window.dispatchEvent(event)
    })
  }

  /**
   * Track PWA events for analytics
   */
  static trackPWAEvent(event: string, data?: Record<string, unknown>) {
    // Integration with analytics (Google Analytics, etc.)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-expect-error - gtag is a global function when Google Analytics is loaded
      window.gtag('event', event, {
        event_category: 'PWA',
        custom_parameter: data,
        ...data
      })
    }

    // Custom analytics or logging
    console.log('PWA Event:', event, data)
  }
}

// Initialize PWA utilities
if (typeof window !== 'undefined') {
  PWAUtils.handleBeforeInstallPrompt()
}

export default PWAUtils
