import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   COMMON HELPERS
========================================= */

function formatEventDate(timestamp) {
  if (!timestamp) return "Date not available";

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  return date.toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}


function escapeEventHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================
   HOMEPAGE PUZZLE EVENT
========================================= */

async function loadHomepagePuzzleEvent() {

  const eventSection = document.getElementById("puzzleEventSection");
  const eventCard = document.getElementById("homepagePuzzleEventCard");

  // Not on homepage
  if (!eventCard) return;

  try {

    const eventsQuery = query(
      collection(db, "puzzleEvents"),
      where("active", "==", true),
      orderBy("startAt", "asc"),
      limit(5)
    );

    const snapshot = await getDocs(eventsQuery);

    const now = new Date();

    let selectedEvent = null;

    snapshot.forEach((eventDoc) => {

      if (selectedEvent) return;

      const event = eventDoc.data();

      const startDate = event.startAt?.toDate
        ? event.startAt.toDate()
        : new Date(event.startAt);

      const endDate = event.endAt?.toDate
        ? event.endAt.toDate()
        : new Date(event.endAt);

      if (endDate > now) {

        selectedEvent = {
          id: eventDoc.id,
          ...event,
          startDate,
          endDate
        };

      }

    });


    if (!selectedEvent) {

      eventCard.innerHTML = `
        <div class="puzzle-event-empty">
          <div class="empty-icon">🧩</div>
          <h3>No Puzzle Event Right Now</h3>
          <p>
            Check back soon for our next puzzle challenge.
          </p>
        </div>
      `;

      return;
    }


    const isUpcoming = selectedEvent.startDate > now;

    const statusText = isUpcoming
      ? "Upcoming Event"
      : "Event Live Now";


    eventCard.innerHTML = `

      <div class="puzzle-event-image">

        <img
          src="${escapeEventHtml(selectedEvent.imageUrl || "images/puzzle-event.jpg")}"
          alt="${escapeEventHtml(selectedEvent.title)}"
        >

      </div>


      <div class="puzzle-event-content">

        <span class="puzzle-event-badge">
          🧩 ${statusText}
        </span>

        <h3>
          ${escapeEventHtml(selectedEvent.title)}
        </h3>

        <p>
          ${escapeEventHtml(selectedEvent.description)}
        </p>


        <div class="puzzle-event-meta">

          <span>
            🧩 ${selectedEvent.numberOfPuzzles || selectedEvent.puzzleCount || 0} puzzles
          </span>

          <span>
            ⏱️ ${selectedEvent.timerSeconds || 0}s each
          </span>

          <span>
            📅 ${formatEventDate(selectedEvent.startAt)}
          </span>

        </div>


        <a
          href="puzzle-event.html?event=${encodeURIComponent(selectedEvent.id)}"
          class="primary-btn puzzle-event-btn"
        >
          View Event
        </a>

      </div>

    `;

  } catch (error) {

    console.error(
      "❌ Error loading homepage Puzzle Event:",
      error
    );

    eventCard.innerHTML = `
      <div class="puzzle-event-empty">
        <div class="empty-icon">🧩</div>

        <h3>Puzzle Event</h3>

        <p>
          Check back soon for our next puzzle challenge.
        </p>
      </div>
    `;
  }
}


/* =========================================
   EVENT INFORMATION PAGE
========================================= */

async function loadPuzzleEventPage() {

  const eventContent = document.getElementById("eventContent");

  // Not on event page
  if (!eventContent) return;


  const loading = document.getElementById("eventLoading");
  const errorBox = document.getElementById("eventError");


  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("event");


  if (!eventId) {

    loading.classList.add("hidden");
    errorBox.classList.remove("hidden");

    return;
  }


  try {

    const eventRef = doc(db, "puzzleEvents", eventId);
    const eventSnapshot = await getDoc(eventRef);


    if (!eventSnapshot.exists()) {

      loading.classList.add("hidden");
      errorBox.classList.remove("hidden");

      return;
    }


    const event = eventSnapshot.data();
    await loadEventLeaderboard(eventId, event);


    /* -----------------------------------------
       BASIC EVENT INFORMATION
    ----------------------------------------- */

    document.title =
      `${event.title || "Puzzle Event"} | Chess News Hub`;


    const eventImage = document.getElementById("eventImage");

    if (eventImage) {

      eventImage.src =
        event.imageUrl || "images/puzzle-event.jpg";

      eventImage.alt =
        event.title || "Puzzle Event";

    }


    document.getElementById("eventTitle").textContent =
      event.title || "Puzzle Event";


    document.getElementById("eventDescription").textContent =
      event.description || "Join this special chess puzzle challenge.";


    document.getElementById("eventDate").textContent =
      `${formatEventDate(event.startAt)} → ${formatEventDate(event.endAt)}`;


    document.getElementById("eventPuzzleCount").textContent =
      `${event.numberOfPuzzles || event.puzzleCount || 0}`;


    document.getElementById("eventTimer").textContent =
      `${event.timerSeconds || 0} seconds`;


    const cooldownHours =
      Number(event.cooldownHours || 0);


    if (cooldownHours === 0) {

      document.getElementById("eventCooldown").textContent =
        "No cooldown";

    } else if (cooldownHours < 1) {

      document.getElementById("eventCooldown").textContent =
        `${Math.round(cooldownHours * 60)} minutes`;

    } else {

      document.getElementById("eventCooldown").textContent =
        `${cooldownHours} hour${cooldownHours === 1 ? "" : "s"}`;

    }


    document.getElementById("eventInstructions").textContent =
      event.instructions ||
      "Follow the instructions provided and solve each puzzle before the timer expires.";


    /* -----------------------------------------
       EVENT STATUS
    ----------------------------------------- */

    const now = new Date();


    const startDate = event.startAt?.toDate
      ? event.startAt.toDate()
      : new Date(event.startAt);


    const endDate = event.endAt?.toDate
      ? event.endAt.toDate()
      : new Date(event.endAt);


    const statusElement =
      document.getElementById("eventStatus");


    const startButton =
      document.getElementById("startEventBtn");


    const startTitle =
      document.getElementById("startTitle");


    const startMessage =
      document.getElementById("startMessage");


    if (now < startDate) {

      statusElement.textContent =
        "⏳ Upcoming";


      startTitle.textContent =
        "Event Has Not Started";


      startMessage.textContent =
        `This event will begin on ${formatEventDate(event.startAt)}.`;


      startButton.disabled = true;

      startButton.textContent =
        "Not Started Yet";

    }


    else if (now >= startDate && now < endDate) {

      statusElement.textContent =
        "🟢 Live Now";


      startTitle.textContent =
        "Ready to Play?";


      startMessage.textContent =
        "The event is live. Test your chess skills and compete for the highest score.";


      startButton.disabled = false;

      startButton.textContent =
        "Start Event";


      startButton.onclick = () => {

        window.location.href =
          `puzzle-event-play.html?event=${encodeURIComponent(eventId)}`;

      };

    }


    else {

      statusElement.textContent =
        "🔴 Event Ended";


      startTitle.textContent =
        "Event Has Ended";


      startMessage.textContent =
        "This Puzzle Event has ended. Check back for the next challenge.";


      startButton.disabled = true;

      startButton.textContent =
        "Event Ended";

    }


    /* -----------------------------------------
       SHOW PAGE
    ----------------------------------------- */

    loading.classList.add("hidden");
    eventContent.classList.remove("hidden");


  } catch (error) {

    console.error(
      "❌ Error loading Puzzle Event:",
      error
    );

    loading.classList.add("hidden");
    errorBox.classList.remove("hidden");

  }

}

/* =========================================
   EVENT LEADERBOARD
========================================= */

async function loadEventLeaderboard(eventId, event) {

  const leaderboardSection =
    document.getElementById("leaderboardSection");

  const leaderboardContent =
    document.getElementById("leaderboardContent");

  if (!leaderboardSection || !leaderboardContent) return;


  // Hide leaderboard if disabled for this event
  if (event.leaderboardEnabled !== true) {

    leaderboardSection.classList.add("hidden");

    return;
  }


  try {

    const resultsQuery = query(
      collection(db, "puzzleEventResults"),
      where("eventId", "==", eventId)
    );

    const snapshot = await getDocs(resultsQuery);


    if (snapshot.empty) {

      leaderboardContent.innerHTML = `
        <div class="leaderboard-empty">
          <div class="state-icon">🏆</div>
          <h3>No Results Yet</h3>
          <p>
            The leaderboard will appear when players complete the event.
          </p>
        </div>
      `;

      return;
    }


    /*
      Keep only the highest official score
      for each player.
    */

    const playerResults = new Map();


    snapshot.forEach((resultDoc) => {

      const result = resultDoc.data();

      const userId = result.userId;

      if (!userId) return;


      const score = Number(result.score || 0);


      if (!playerResults.has(userId)) {

        playerResults.set(userId, {
          userId,
          score,
          correctAnswers: Number(result.correctAnswers || 0)
        });

        return;
      }


      const existingResult =
        playerResults.get(userId);


      if (score > existingResult.score) {

        playerResults.set(userId, {
          userId,
          score,
          correctAnswers: Number(result.correctAnswers || 0)
        });

      }

    });


    /*
      Sort highest score first.
    */

    const leaderboard =
      Array.from(playerResults.values())
        .sort((a, b) => b.score - a.score);


    if (!leaderboard.length) {

      leaderboardContent.innerHTML = `
        <div class="leaderboard-empty">
          <div class="state-icon">🏆</div>
          <h3>No Results Yet</h3>
          <p>
            The leaderboard will appear when players complete the event.
          </p>
        </div>
      `;

      return;
    }


    /*
      Get player names.
    */

    const userIds =
      leaderboard.map(player => player.userId);


    const playerData = new Map();


    await Promise.all(
      userIds.map(async (userId) => {

        try {

          const userSnapshot =
            await getDoc(doc(db, "users", userId));


          if (userSnapshot.exists()) {

            const user = userSnapshot.data();

            playerData.set(userId, {
              name:
                user.displayName ||
                user.username ||
                user.name ||
                "Chess Player",

              photoURL:
                user.photoURL || ""
            });

          }

        } catch (error) {

          console.error(
            `Could not load player ${userId}:`,
            error
          );

        }

      })
    );


    /*
      Build leaderboard.
    */

    leaderboardContent.innerHTML =
      leaderboard.map((player, index) => {

        const playerInfo =
          playerData.get(player.userId) || {
            name: "Chess Player",
            photoURL: ""
          };


        const rank = index + 1;


        let rankDisplay = rank;

        if (rank === 1) rankDisplay = "🥇";
        else if (rank === 2) rankDisplay = "🥈";
        else if (rank === 3) rankDisplay = "🥉";


        const safeName =
          escapeEventHtml(playerInfo.name);


        return `
          <div class="leaderboard-row">

            <div class="leaderboard-rank">
              ${rankDisplay}
            </div>

            <div class="leaderboard-player">

              ${
                playerInfo.photoURL
                  ? `
                    <img
                      src="${escapeEventHtml(playerInfo.photoURL)}"
                      alt="${safeName}"
                      class="leaderboard-avatar"
                    >
                  `
                  : `
                    <div class="leaderboard-avatar-placeholder">
                      ♟
                    </div>
                  `
              }

              <span>
                ${safeName}
              </span>

            </div>

            <div class="leaderboard-score">
              ${player.score} pts
            </div>

          </div>
        `;

      }).join("");


  } catch (error) {

    console.error(
      "❌ Error loading event leaderboard:",
      error
    );


    leaderboardContent.innerHTML = `
      <div class="leaderboard-empty">
        <div class="state-icon">⚠️</div>
        <h3>Leaderboard Unavailable</h3>
        <p>
          We could not load the event leaderboard right now.
        </p>
      </div>
    `;

  }

}
/* =========================================
   INITIALIZE
========================================= */

loadHomepagePuzzleEvent();
loadPuzzleEventPage();
