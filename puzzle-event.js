/* =====================================================
   PUZZLE EVENT HOMEPAGE
   Chess News Hub
===================================================== */

import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const eventSection =
  document.getElementById(
    "puzzleEventSection"
  );

const eventCard =
  document.getElementById(
    "homepagePuzzleEventCard"
  );


/* =====================================================
   FORMAT DATE
===================================================== */

function formatEventDate(timestamp) {

  if (!timestamp) {
    return "Date unavailable";
  }

  try {

    const date =
      timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

    return new Intl.DateTimeFormat(
      "en-NG",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    ).format(date);

  } catch (error) {

    return "Date unavailable";

  }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeEventHtml(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   LOAD ACTIVE PUZZLE EVENT
===================================================== */

async function loadHomepagePuzzleEvent() {

  if (!eventCard) {
    return;
  }


  try {

    const now =
      new Date();


    /*
     * First find active/scheduled events.
     *
     * We intentionally load a small number here.
     */

    const snapshot =
      await getDocs(
        query(
          collection(db, "puzzleEvents"),
          where("active", "==", true),
          orderBy("startAt", "asc"),
          limit(5)
        )
      );


    let selectedEvent = null;


    /*
     * Find the first event that has not ended.
     */

    snapshot.forEach(eventDoc => {

      if (selectedEvent) {
        return;
      }


      const event =
        eventDoc.data();


      const endDate =
        event.endAt?.toDate
          ? event.endAt.toDate()
          : new Date(event.endAt);


      if (
        !endDate ||
        endDate > now
      ) {

        selectedEvent = {

          id:
            eventDoc.id,

          ...event

        };

      }

    });


    /* -----------------------------------------------
       NO EVENT
    ------------------------------------------------ */

    if (!selectedEvent) {

      eventCard.innerHTML = `

        <div class="puzzle-event-empty">

          <div class="puzzle-event-empty-icon">
            🧩
          </div>

          <h3>
            No Puzzle Event Right Now
          </h3>

          <p>
            Stay tuned. A new chess puzzle challenge
            will appear here soon.
          </p>

        </div>

      `;

      return;

    }


    /* -----------------------------------------------
       EVENT DATA
    ------------------------------------------------ */

    const title =
      escapeEventHtml(
        selectedEvent.title ||
        "Puzzle Challenge"
      );


    const description =
      escapeEventHtml(
        selectedEvent.description ||
        "Challenge yourself with a series of chess puzzles."
      );


    const imageUrl =
      selectedEvent.imageUrl ||
      "";


    const puzzleCount =
      Number(
        selectedEvent.numberOfPuzzles
      ) || 0;


    const timer =
      Number(
        selectedEvent.timerSeconds
      ) || 0;


    const startDate =
      formatEventDate(
        selectedEvent.startAt
      );


    const endDate =
      formatEventDate(
        selectedEvent.endAt
      );


    /* -----------------------------------------------
       DISPLAY EVENT
    ------------------------------------------------ */

    eventCard.innerHTML = `

      ${
        imageUrl
          ? `
            <div
              class="puzzle-event-image"
              style="
                background-image:
                  url('${escapeEventHtml(imageUrl)}');
              "
            ></div>
          `
          : `
            <div
              class="puzzle-event-image"
              style="
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:5rem;
              "
            >
              🧩
            </div>
          `
      }


      <div class="puzzle-event-content">

        <span class="puzzle-event-badge">
          🧩 PUZZLE EVENT
        </span>


        <h3>
          ${title}
        </h3>


        <p>
          ${description}
        </p>


        <div class="puzzle-event-meta">

          <span>
            🧩 ${puzzleCount} Puzzles
          </span>

          <span>
            ⏱️ ${timer}s Each
          </span>

          <span>
            📅 ${startDate}
          </span>

        </div>


        <a
          href="puzzle-event.html?event=${encodeURIComponent(
            selectedEvent.id
          )}"
          class="puzzle-event-button"
        >
          View Event →
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

        <div class="puzzle-event-empty-icon">
          🧩
        </div>

        <h3>
          Puzzle Event
        </h3>

        <p>
          Check back soon for our next puzzle challenge.
        </p>

      </div>

    `;

  }

}


/* =====================================================
   START
===================================================== */

loadHomepagePuzzleEvent();
