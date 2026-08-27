import { auth, db, messaging } from "./firebase.js";

import {
  getToken,
  onMessage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// =====================================================
// YOUR VAPID PUBLIC KEY
// =====================================================

const VAPID_KEY =
  "BEMJWtL68lEVGcfcLDEIKivI56JOkXLGesi9ULulLOis5tJfxUVZJvEFk5RDxFwe4CEQXUUmak1PHYd8O91ICdQ";


// =====================================================
// REQUEST NOTIFICATION PERMISSION
// =====================================================

async function enableNotifications() {

  try {

    console.log("🔔 Requesting notification permission...");

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {

      console.log(
        "❌ Notification permission was not granted."
      );

      return;

    }

    console.log(
      "✅ Notification permission granted."
    );


    // =================================================
    // GET SERVICE WORKER REGISTRATION
    // =================================================

    const registration =
      await navigator.serviceWorker.ready;


    // =================================================
    // GET FCM TOKEN
    // =================================================

    const token =
      await getToken(messaging, {

        vapidKey: VAPID_KEY,

        serviceWorkerRegistration:
          registration

      });


    if (!token) {

      console.log(
        "❌ No FCM registration token available."
      );

      return;

    }


    console.log(
      "🔥 FCM TOKEN:",
      token
    );


    // =================================================
    // SAVE TOKEN TO FIRESTORE
    // =================================================

    const user =
      auth.currentUser;

    if (!user) {

      console.log(
        "⚠️ User is not logged in."
      );

      return;

    }


    await setDoc(

      doc(
        db,
        "users",
        user.uid
      ),

      {

        notificationToken:
          token,

        notificationsEnabled:
          true

      },

      {

        merge: true

      }

    );


    console.log(
      "✅ Notification token saved to Firestore."
    );

  }

  catch (error) {

    console.error(
      "❌ Notification setup failed:",
      error
    );

  }

}


// =====================================================
// WAIT FOR LOGIN
// =====================================================


// =====================================================
// WAIT FOR USER LOGIN
// =====================================================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    console.log("👤 No logged-in user.");

    return;

  }

  console.log("👤 Logged in:", user.uid);

  await enableNotifications();

});

// Instead of modifying your existing auth.js,
// listen to the authentication state here.




onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      console.log(
        "👤 No logged-in user."
      );

      return;

    }

    console.log(
      "👤 Logged in:",
      user.uid
    );

    await enableNotifications();

  }
);


// =====================================================
// FOREGROUND MESSAGE
// =====================================================

onMessage(
  messaging,
  (payload) => {

    console.log(
      "🔔 Foreground notification:",
      payload
    );

    const title =
      payload.notification?.title ||
      "Chess News Hub";

    const body =
      payload.notification?.body ||
      "You have a new update.";

    alert(
      `${title}\n\n${body}`
    );

  }
);
