import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
