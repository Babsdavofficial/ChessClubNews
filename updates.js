let isAdmin = false;
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
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    isAdmin = false;
    return;
  }

  const userSnap = await getDoc(
    doc(db, "users", user.uid)
  );

  if (
    userSnap.exists() &&
    userSnap.data().role === "admin"
  ) {
    isAdmin = true;
  }

});

const updatesContainer = document.getElementById("updatesContainer");

async function loadUpdates() {

  if (!updatesContainer) return;

  updatesContainer.innerHTML =
    "<p>Loading updates...</p>";

  const q = query(
    collection(db, "updates"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    updatesContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const update = docSnap.data();
      const updateId = docSnap.id;

      updatesContainer.innerHTML += `
        <div class="card">

          ${update.imageUrl ? `
            <img
              src="${update.imageUrl}"
              style="
                width:100%;
                border-radius:14px;
                margin-bottom:12px;
              ">
          ` : ""}

          <div class="chip">
            Latest Update
          </div>

          <h3>${update.title}</h3>

          <p>${update.content}</p>

          <hr style="margin:15px 0;opacity:.2;">

          <div style="
            display:flex;
            justify-content:space-between;
            gap:10px;
            flex-wrap:wrap;
          ">

            <div style="display:flex;gap:12px;">
              <span>
                ❤️ ${update.likes || 0} Likes
              </span>

              <span>
                💬 ${update.commentsCount || 0} Comments
              </span>
            </div>

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

              ${isAdmin ? `
                <button
                  class="btn secondary deleteUpdateBtn"
                  data-id="${updateId}">
                  🗑 Delete
                </button>
              ` : ""}

            </div>

          </div>

          <div
            id="comments-${updateId}"
            class="commentsSection"
            style="
              display:none;
              margin-top:15px;
            ">

            <div
              id="commentsList-${updateId}"
              class="comments-list">
            </div>

            <textarea
              id="commentInput-${updateId}"
              rows="2"
              placeholder="Write a comment..."
              style="
                width:100%;
                padding:10px;
                border-radius:12px;
                height:120px;
                resize:none;
              ">
            </textarea>

            <br><br>

            <button
              class="btn primary postCommentBtn"
              data-id="${updateId}">
              Post Comment
            </button>

          </div>

          <br>

        </div>
      `;

    });

  });

}

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
  <div class="comment-bubble">

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
    ">

      <div>
        <strong>${comment.username}</strong><br>
        ${comment.text}
      </div>

      ${isAdmin ? `
      <button
        class="btn secondary deleteCommentBtn"
        data-id="${docSnap.id}"
        data-update="${updateId}">
        🗑
      </button>
      ` : ""}

    </div>

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
  await updateDoc(
  doc(db, "updates", updateId),
  {
    commentsCount: increment(1)
  }
);

  input.value = "";

  await loadComments(updateId);

});
document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("deleteUpdateBtn")) return;

  const user = auth.currentUser;

  if (!user) {
    alert("Login required.");
    return;
  }

  if (!confirm("Delete this update?")) {
    return;
  }

  const updateId = e.target.dataset.id;

  try {

    // Delete update document
    await deleteDoc(
      doc(db, "updates", updateId)
    );

    // Delete comments
    const commentsQuery = query(
      collection(db, "comments"),
      where("updateId", "==", updateId)
    );

    const commentsSnap = await getDocs(commentsQuery);

    for (const commentDoc of commentsSnap.docs) {
      await deleteDoc(commentDoc.ref);
    }

    // Delete likes
    const likesQuery = query(
      collection(db, "updateLikes"),
      where("updateId", "==", updateId)
    );

    const likesSnap = await getDocs(likesQuery);

    for (const likeDoc of likesSnap.docs) {
      await deleteDoc(likeDoc.ref);
    }

    alert("✅ Update deleted.");

    loadUpdates();

  } catch (error) {

    console.error(error);

    alert("Delete failed.");

  }

});
document.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("deleteCommentBtn"))
    return;

  if (!confirm("Delete this comment?"))
    return;

  const commentId =
    e.target.dataset.id;

  const updateId =
    e.target.dataset.update;

  try {

    await deleteDoc(
      doc(db, "comments", commentId)
    );

    await updateDoc(
      doc(db, "updates", updateId),
      {
        commentsCount: increment(-1)
      }
    );

    alert("✅ Comment deleted");

    loadComments(updateId);

  } catch (error) {

    console.error(error);

    alert("Failed to delete comment");

  }

});
 
