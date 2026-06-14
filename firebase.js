// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

// Export them so we can use them in other files later
export { db, auth };
