// =====================================================
// CHESS NEWS HUB — SERVICE WORKER
// =====================================================

const CACHE_NAME = "chess-news-hub-v5.12";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./community.html",
  "./matches.html",
  "./standings.html",
  "./updates.html",
  "./players.html",
  "./admin.html",
  "./login.html",
  "./community-layout.css",

  "./style.css",
  "./manifest.json",

  "./firebase.js",
  "./auth.js",
  "./community.js",
  "./achievement.js",
  "./updates.js",
  "./admin.js",
  "./adminContent.js",
  "./notifications.js"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => {

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  self.skipWaiting();

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then((cacheNames) => {

      return Promise.all(

        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))

      );

    })

  );

  self.clients.claim();

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request).then((cachedResponse) => {

      return cachedResponse || fetch(event.request);

    })

  );

});


// =====================================================
// FIREBASE PUSH NOTIFICATIONS
// =====================================================

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);


// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyA_QXqMN00OrYJNAg-RbH0Y0hHMEoUOTxk",
  authDomain: "chess-news-hub.firebaseapp.com",
  projectId: "chess-news-hub",
  storageBucket: "chess-news-hub.firebasestorage.app",
  messagingSenderId: "494413852029",
  appId: "1:494413852029:web:9255a597bda885d9823014"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


// =====================================================
// BACKGROUND NOTIFICATION
// =====================================================

messaging.onBackgroundMessage((payload) => {

  console.log(
    "[sw.js] Background notification:",
    payload
  );

  const notificationTitle =
    payload.notification?.title ||
    "Chess News Hub";

  const notificationOptions = {

    body:
      payload.notification?.body ||
      "You have a new update from Chess News Hub.",

    icon:
      "./icons/icon-192.png",

    badge:
      "./icons/icon-192.png",

    // Store the page to open
    data: {
      url: "./index.html"
    }

  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});


// =====================================================
// NOTIFICATION CLICK
// =====================================================

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();

    const urlToOpen =
      event.notification.data?.url ||
      "./index.html";

    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      }).then((clientList) => {

        // If Chess Hub is already open,
        // focus on it
        for (const client of clientList) {

          if (
            client.url.includes(
              "babsdavofficial.github.io/ChessClubNews"
            ) &&
            "focus" in client
          ) {

            return client.focus();

          }

        }

        // Otherwise open Chess Hub
        if (clients.openWindow) {

          return clients.openWindow(
            urlToOpen
          );

        }

      })

    );

  }
);
