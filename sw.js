// =====================================================
// CHESS NEWS HUB — SERVICE WORKER
// =====================================================

const CACHE_NAME = "chess-news-hub-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./community.html",
  "./matches.html",
  "./standings.html",
  "./updates.html",
  "./players.html",
  "./admin.html",

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

// Import Firebase Messaging libraries

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js"
);


// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

// IMPORTANT:
// We will put your Firebase configuration here next.
// Do NOT guess or copy random values.

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


// Initialize Firebase




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
      "./icons/icon-192.png"

  };


  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});
