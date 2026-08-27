// =====================================================
// FIREBASE PUSH NOTIFICATIONS
// =====================================================

import { auth, db } from "./firebase.js";

import {
  getMessaging,
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Firebase Messaging
const messaging = getMessaging();


// =====================================================
// VAPID PUBLIC KEY
// =====================================================

const VAPID_KEY =
  "BEMJWtL68lEVGcfcLDEIKivI56JOkXLGesi9ULulLOis5tJfxUVZJvEFk5RDxFwe4CEQXUUmak1PHYd8O91ICdQ";


// =====================================================
// REQUEST NOTIFICATION PERMISSION
// =====================================================

async function enableNotifications() {

  try {

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {

      console.log("🔕 Notification permission not granted.");

      return;

    }

    console.log("🔔 Notification permission granted.");


    // =================================================
    // GET FCM TOKEN
    // =================================================

    const token = await getToken(
      messaging,
      {
        vapidKey: VAPID_KEY
      }
    );


    if (!token) {

      console.log(
        "⚠️ No FCM token received."
      );

      return;

    }


    console.log(
      "✅ FCM Token:",
      token
    );


    // =================================================
    // SAVE TOKEN TO USER
    // =================================================

    if (auth.currentUser) {

      await setDoc(

        doc(
          db,
          "users",
          auth.currentUser.uid
        ),

        {
          fcmToken: token
        },

        {
          merge: true
        }

      );

      console.log(
        "✅ Notification token saved."
      );

    }

  }

  catch (error) {

    console.error(
      "❌ Notification setup failed:",
      error
    );

  }

}


// =====================================================
// RECEIVE NOTIFICATIONS WHILE WEBSITE IS OPEN
// =====================================================

onMessage(
  messaging,
  (payload) => {

    console.log(
      "🔔 Notification received:",
      payload
    );

    if (
      payload.notification
    ) {

      new Notification(
        payload.notification.title ||
        "Chess News Hub",
        {
          body:
            payload.notification.body ||
            "You have a new update."
        }
      );

    }

  }
);


// =====================================================
// EXPORT
// =====================================================

export {
  enableNotifications
};
