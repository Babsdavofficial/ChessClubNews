import { db } from "./firebase.js";

import {
  collection,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const updatesContainer = document.getElementById("updatesContainer");

async function loadUpdates() {
  if (!updatesContainer) return;

  updatesContainer.innerHTML = "<p>Loading updates...</p>";

  const q = query(
    collection(db, "updates"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  updatesContainer.innerHTML = "";

  snapshot.forEach((doc) => {
    const update = doc.data();

    updatesContainer.innerHTML += `
      <div class="card">
        ${update.imageUrl ? `
          <img src="${update.imageUrl}"
               style="width:100%;border-radius:14px;margin-bottom:12px;">
        ` : ""}

        <div class="chip">Latest Update</div>
        <h3>${update.title}</h3>
        <p>${update.content}</p>

        <hr style="margin:15px 0;opacity:.2;">

        <div style="display:flex;justify-content:space-between;">
          <span>❤️ ${update.likes || 0} Likes</span>
          <button class="btn secondary">Like</button>
        </div>
      </div>
      <br>
    `;
  });
}

loadUpdates();
