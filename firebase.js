// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_QXqMN00OrYJNAg-RbH0Y0hHMEoUOTxk",
  authDomain: "chess-news-hub.firebaseapp.com",
  projectId: "chess-news-hub",
  storageBucket: "chess-news-hub.firebasestorage.app",
  messagingSenderId: "494413852029",
  appId: "1:494413852029:web:9255a597bda885d9823014"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

// Your Web Push VAPID key
const VAPID_KEY =
  "BEMJWtL68lEVGcfcLDEIKivI56JOkXLGesi9ULulLOis5tJfxUVZJvEFk5RDxFwe4CEQXUUmak1PHYd8O91ICdQ";

// Enable browser notifications
export async function enableNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.log("No FCM token available.");
      return null;
    }

    console.log("FCM token:", token);

    return token;

  } catch (error) {
    console.error(
      "Notification setup failed:",
      error
    );

    return null;
  }
}

// Receive messages while the website is open
onMessage(messaging, (payload) => {
  console.log(
    "Foreground notification:",
    payload
  );
});

// Export Firebase services
export {
  db,
  auth,
  messaging
};

console.log("🔥 Firebase Connected Successfully!");
