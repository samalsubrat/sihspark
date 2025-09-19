const CACHE_NAME = 'spark-v2.0.0';
const STATIC_CACHE = 'spark-static-v2.0.0';
const DYNAMIC_CACHE = 'spark-dynamic-v2.0.0';
const API_CACHE = 'spark-api-v2.0.0';

// Static resources to cache on install
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-32x32.png',
  '/icons/icon-16x16.png',
  // Add critical pages
  '/sign-in',
  '/sign-up',
  '/waterquality',
  '/education',
  '/news'
];

// API endpoints that should be cached
const API_ENDPOINTS = [
  '/api/water-quality',
  '/api/v1/water-tests',
  '/api/v1/reports'
];

// Resources that should always be fetched from network
const NETWORK_FIRST = [
  '/api/auth',
  '/api/v1/auth',
  '/api/chat'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static resources');
        return cache.addAll(urlsToCache);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same origin requests
    if (isStaticAsset(request)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(request)) {
      event.respondWith(networkFirstAPI(request));
    } else if (isPageRequest(request)) {
      event.respondWith(networkFirstPage(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  } else {
    // External requests - try cache first, then network
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy - for static assets
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy for API requests
async function networkFirstAPI(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Network unavailable', 
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network first strategy for pages
async function networkFirstPage(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for page, trying cache:', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(STATIC_CACHE);
      return offlineCache.match('/offline') || new Response('Offline');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const networkResponse = fetch(request).then(response => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cached || networkResponse;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/) ||
         url.pathname.startsWith('/icons/') ||
         url.pathname === '/manifest.json';
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
}

function isPageRequest(request) {
  return request.mode === 'navigate' || 
         request.destination === 'document' ||
         (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'water-test-sync') {
    event.waitUntil(syncWaterTests());
  } else if (event.tag === 'report-sync') {
    event.waitUntil(syncReports());
  }
});

async function syncWaterTests() {
  try {
    // Get offline water test data from IndexedDB or localStorage
    const offlineData = await getOfflineWaterTests();
    
    for (const data of offlineData) {
      try {
        const response = await fetch('/api/v1/water-tests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineWaterTest(data.id);
          console.log('Synced water test:', data.id);
        }
      } catch (error) {
        console.log('Failed to sync water test:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

async function syncReports() {
  // Similar implementation for reports
  console.log('Syncing reports...');
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update from SPARK',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Math.random().toString(36).substr(2, 9)
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/icon-96x96.png'
      }
    ],
    requireInteraction: false,
    tag: 'spark-notification'
  };

  event.waitUntil(
    self.registration.showNotification('SPARK Water Quality', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  const action = event.action;
  const notification = event.notification;

  if (action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    console.log('Notification dismissed');
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          return clients[0].focus();
        } else {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Placeholder functions for offline data management
async function getOfflineWaterTests() {
  // Implementation would use IndexedDB to get offline data
  return [];
}

async function removeOfflineWaterTest(id) {
  // Implementation would remove data from IndexedDB
  console.log('Removing offline water test:', id);
}
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync for offline data
  console.log('Background sync triggered');
  // Add your offline data sync logic here
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from SIH Spark',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SIH Spark', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
