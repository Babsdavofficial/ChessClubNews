import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const publishBtn = document.getElementById("publishUpdateBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", async () => {

    const title = document.getElementById("updateTitle").value.trim();
    const content = document.getElementById("updateContent").value.trim();
    const imageName = document.getElementById("updateImage").value.trim();

    if (!title || !content) {
      alert("Please fill in the title and update message.");
      return;
    }

    // GitHub image path
    const baseImageUrl =
      "https://babsdavofficial.github.io/ChessClubNews/images/";

    const imageUrl = imageName
      ? baseImageUrl + imageName
      : "";

    try {
      await addDoc(collection(db, "updates"), {
        title: title,
        content: content,
        imageUrl: imageUrl,
        author: auth.currentUser ? auth.currentUser.uid : "admin",
        likes: 0,
        createdAt: serverTimestamp()
      });

      alert("✅ Update published successfully!");

      // Clear form
      document.getElementById("updateTitle").value = "";
      document.getElementById("updateContent").value = "";
      document.getElementById("updateImage").value = "";

    } catch (error) {
      console.error(error);
      alert("❌ Failed to publish update.");
    }

  });
}
// =========================
// CREATE EVENT
// =========================

const createEventBtn =
  document.getElementById("createEventBtn");

if (createEventBtn) {

  createEventBtn.addEventListener(
    "click",
    async () => {

      const title =
        document
        .getElementById("eventTitle")
        .value
        .trim();

      const description =
        document
        .getElementById("eventDescription")
        .value
        .trim();

      if (!title || !description) {

        alert(
          "Please enter title and description."
        );

        return;
      }

      try {

        await addDoc(
          collection(db, "events"),
          {
            title,
            description,
            active: true,
            createdAt: serverTimestamp()
          }
        );

        alert(
          "✅ Event created successfully!"
        );

        document.getElementById(
          "eventTitle"
        ).value = "";

        document.getElementById(
          "eventDescription"
        ).value = "";

      } catch (error) {

        console.error(error);

        alert(
          "Failed to create event."
        );

      }

    }
  );

}
