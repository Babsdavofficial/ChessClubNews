
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

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
  const updateId = doc.id;

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

      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
  <span>❤️ ${update.likes || 0} Likes</span>

  <div>
    <button
      class="btn secondary likeBtn"
      data-id="${updateId}">
      ❤️ Like
    </button>

    <button
      class="btn primary toggleCommentsBtn"
      data-id="${updateId}">
      💬 Comments
    </button>
  </div>
</div>

<div
  id="comments-${updateId}"
  class="commentsSection"
  style="display:none;margin-top:15px;">

  <div
    id="commentsList-${updateId}"
    style="margin-bottom:10px;">
  </div>

  <textarea
    id="commentInput-${updateId}"
    rows="2"
    placeholder="Write a comment..."
    style="width:100%;padding:10px;border-radius:12px;">
  </textarea>

  <br><br>

  <button
    class="btn primary postCommentBtn"
    data-id="${updateId}">
    Post Comment
  </button>

</div>
    <br>
  `;
});

} // closes loadUpdates()

loadUpdates();

// =========================
// LIKE UPDATE
// =========================

document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("likeBtn")) return;

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  const updateId = e.target.dataset.id;

  const likeRef = doc(
    db,
    "updateLikes",
    `${updateId}_${user.uid}`
  );

  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    alert("You already liked this update.");
    return;
  }

  await setDoc(likeRef, {
    updateId,
    userId: user.uid
  });

  await updateDoc(
    doc(db, "updates", updateId),
    {
      likes: increment(1)
    }
  );

  alert("❤️ Liked!");

  loadUpdates();

});


// =========================
// OPEN/CLOSE COMMENTS
// =========================

document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("toggleCommentsBtn")) return;

  const updateId = e.target.dataset.id;

  const section =
    document.getElementById(`comments-${updateId}`);

  if (!section) return;

  if (section.style.display === "none") {

    section.style.display = "block";

    await loadComments(updateId);

  } else {

    section.style.display = "none";

  }

});


// =========================
// LOAD COMMENTS
// =========================

async function loadComments(updateId) {

  const commentsList =
    document.getElementById(`commentsList-${updateId}`);

  if (!commentsList) return;

  commentsList.innerHTML = "Loading comments...";

  const q = query(
    collection(db, "comments"),
    where("updateId", "==", updateId)
  );

  const snapshot = await getDocs(q);

  commentsList.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const comment = docSnap.data();

    commentsList.innerHTML += `
      <div style="
        background:#f3f3f3;
        padding:10px;
        border-radius:10px;
        margin-bottom:10px;
      ">
        <strong>${comment.username}</strong><br>
        ${comment.text}
      </div>
    `;

  });

}


// =========================
// POST COMMENT
// =========================

document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("postCommentBtn")) return;

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  const updateId = e.target.dataset.id;

  const input =
    document.getElementById(`commentInput-${updateId}`);

  const text = input.value.trim();

  if (!text) {
    alert("Write a comment first.");
    return;
  }

  const userSnap = await getDoc(
    doc(db, "users", user.uid)
  );

  const username =
    userSnap.exists()
      ? userSnap.data().username
      : "Anonymous";

  await addDoc(
    collection(db, "comments"),
    {
      updateId,
      userId: user.uid,
      username,
      text,
      createdAt: serverTimestamp()
    }
  );

  input.value = "";

  await loadComments(updateId);

});
