// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA8joQ-Pkamw4hIrAPM_l8x-0F9i3PoDhg",
    authDomain: "football-canvas-hub.firebaseapp.com",
    projectId: "football-canvas-hub",
    storageBucket: "football-canvas-hub.firebasestorage.app",
    messagingSenderId: "204217889930",
    appId: "1:204217889930:web:cffd81bfa434fb470b6973",
    measurementId: "G-8H7HNB83XN"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📱 [BACKGROUND] Received message:', payload);
    
    const notificationTitle = payload.notification?.title ||
        payload.data?.title ||
        'Football Canvas Hub';
    
    const notificationOptions = {
        body: payload.notification?.body ||
            payload.data?.body ||
            'New notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: payload.data,
        actions: [
            { action: 'open', title: 'View' },
            { action: 'close', title: 'Dismiss' }
        ],
        tag: payload.data?.id || 'fcm-notification',
        renotify: true,
        requireInteraction: true,
        silent: false,
        timestamp: Date.now()
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('📱 Notification clicked:', event);
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Check if there's already a window/tab open
            for (const client of clientList) {
                if (client.url.includes('/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window/tab
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('📱 Notification closed:', event);
});