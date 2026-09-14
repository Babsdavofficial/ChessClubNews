import { db, auth } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  recordUserActivity
} from "./community.js";


/* =========================================
   GLOBAL STATE
========================================= */

let eventId = null;
let eventData = null;

let selectedPuzzles = [];
let currentPuzzleIndex = 0;

let currentPuzzle = null;

let currentScore = 0;
let correctAnswers = 0;

let timerInterval = null;
let remainingSeconds = 0;

let hasSubmitted = false;


/* =========================================
   DOM ELEMENTS
========================================= */

const playLoading =
  document.getElementById("playLoading");

const playError =
  document.getElementById("playError");

const playErrorMessage =
  document.getElementById("playErrorMessage");

const gameContainer =
  document.getElementById("gameContainer");

const resultContainer =
  document.getElementById("resultContainer");

const gameEventTitle =
  document.getElementById("gameEventTitle");

const currentPuzzleNumber =
  document.getElementById("currentPuzzleNumber");

const totalPuzzleNumber =
  document.getElementById("totalPuzzleNumber");

const puzzleTimer =
  document.getElementById("puzzleTimer");

const puzzleImage =
  document.getElementById("puzzleImage");

const puzzlePoints =
  document.getElementById("puzzlePoints");

const puzzleAnswer =
  document.getElementById("puzzleAnswer");

const submitPuzzleBtn =
  document.getElementById("submitPuzzleBtn");

const answerStatus =
  document.getElementById("answerStatus");

const currentScoreElement =
  document.getElementById("currentScore");

const finalScore =
  document.getElementById("finalScore");

const finalCorrect =
  document.getElementById("finalCorrect");

const finalTotal =
  document.getElementById("finalTotal");

const backToEventBtn =
  document.getElementById("backToEventBtn");


/* =========================================
   HELPERS
========================================= */

function showError(message) {

  playLoading.classList.add("hidden");
  gameContainer.classList.add("hidden");

  playErrorMessage.textContent = message;

  playError.classList.remove("hidden");
}


function timestampToDate(timestamp) {

  if (!timestamp) return null;

  if (timestamp.toDate) {
    return timestamp.toDate();
  }

  return new Date(timestamp);
}


function normalizeAnswer(answer) {

  return String(answer || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}


function getPuzzleImageUrl(puzzle) {

  if (puzzle.imageUrl) {
    return puzzle.imageUrl;
  }

  if (puzzle.image) {
    return puzzle.image;
  }

  if (puzzle.imageName) {
    return `https://babsdavofficial.github.io/ChessClubNews/images/${puzzle.imageName}`;
  }

  return "";
}


function getAssignedPoints(assignedPuzzle) {

  const points = Number(assignedPuzzle.points);

  return Number.isFinite(points) && points > 0
    ? points
    : 0;
}


/* =========================================
   GET EVENT ID
========================================= */

function getEventIdFromUrl() {

  const params =
    new URLSearchParams(window.location.search);

  return params.get("event");
}


/* =========================================
   LOAD EVENT
========================================= */

async function loadEvent() {

  eventId = getEventIdFromUrl();

  if (!eventId) {

    showError(
      "No Puzzle Event was specified."
    );

    return;
  }


  const eventRef =
    doc(db, "puzzleEvents", eventId);

  const eventSnapshot =
    await getDoc(eventRef);


  if (!eventSnapshot.exists()) {

    showError(
      "This Puzzle Event no longer exists."
    );

    return;
  }


  eventData = eventSnapshot.data();


  /* -----------------------------------------
     CHECK EVENT TIME
  ----------------------------------------- */

  const now = new Date();

  const startDate =
    timestampToDate(eventData.startAt);

  const endDate =
    timestampToDate(eventData.endAt);


  if (!startDate || !endDate) {

    showError(
      "This event does not have a valid schedule."
    );

    return;
  }


  if (now < startDate) {

    showError(
      `This event has not started yet. It begins on ${startDate.toLocaleString("en-NG")}.`
    );

    return;
  }


  if (now >= endDate) {

    showError(
      "This Puzzle Event has already ended."
    );

    return;
  }


  /* -----------------------------------------
     CHECK LOGIN
  ----------------------------------------- */

  const user =
    auth.currentUser;


  if (!user) {

    showError(
      "You must be logged in to participate in a Puzzle Event."
    );

    return;
  }


  /* -----------------------------------------
     CHECK ASSIGNED PUZZLES
  ----------------------------------------- */

  const assignedPuzzles =
    Array.isArray(eventData.assignedPuzzles)
      ? eventData.assignedPuzzles
      : [];


  if (assignedPuzzles.length === 0) {

    showError(
      "This event does not have any puzzles assigned yet."
    );

    return;
  }


  const requiredCount =
    Number(
      eventData.numberOfPuzzles ||
      eventData.puzzleCount ||
      1
    );


  if (assignedPuzzles.length < requiredCount) {

    showError(
      "This event has not been configured with enough puzzles yet."
    );

    return;
  }


  /* -----------------------------------------
     CHECK COOLDOWN
  ----------------------------------------- */

  const canPlay =
    await checkReplayCooldown(user.uid);

  if (!canPlay) {
    return;
  }


  /* -----------------------------------------
     LOAD PUZZLES
  ----------------------------------------- */

  await loadAssignedPuzzles(
    assignedPuzzles,
    requiredCount
  );


  if (selectedPuzzles.length === 0) {

    showError(
      "The puzzles for this event could not be loaded."
    );

    return;
  }


  /* -----------------------------------------
     PREPARE UI
  ----------------------------------------- */

  gameEventTitle.textContent =
    eventData.title || "Puzzle Event";

  totalPuzzleNumber.textContent =
    selectedPuzzles.length;

  backToEventBtn.href =
    `puzzle-event.html?event=${encodeURIComponent(eventId)}`;


  playLoading.classList.add("hidden");

  gameContainer.classList.remove("hidden");


  /* -----------------------------------------
     START
  ----------------------------------------- */

  startPuzzle();
}


/* =========================================
   CHECK REPLAY COOLDOWN
========================================= */

async function checkReplayCooldown(uid) {

  const cooldownHours =
    Number(eventData.cooldownHours || 0);


  if (cooldownHours <= 0) {
    return true;
  }


  const resultsQuery =
    query(
      collection(db, "puzzleEventResults"),
      where("eventId", "==", eventId),
      where("userId", "==", uid)
    );


  const snapshot =
    await getDocs(resultsQuery);


  if (snapshot.empty) {
    return true;
  }


  let latestResult = null;


  snapshot.forEach((resultDoc) => {

    const result =
      resultDoc.data();

    const completedAt =
      timestampToDate(result.completedAt);

    if (!completedAt) return;

    if (
      !latestResult ||
      completedAt > latestResult
    ) {
      latestResult = completedAt;
    }

  });


  if (!latestResult) {
    return true;
  }


  const cooldownMilliseconds =
    cooldownHours * 60 * 60 * 1000;


  const nextAllowedTime =
    latestResult.getTime() +
    cooldownMilliseconds;


  if (Date.now() < nextAllowedTime) {

    const remainingMilliseconds =
      nextAllowedTime - Date.now();


    const remainingHours =
      Math.floor(
        remainingMilliseconds /
        (60 * 60 * 1000)
      );


    const remainingMinutes =
      Math.ceil(
        (
          remainingMilliseconds %
          (60 * 60 * 1000)
        ) /
        (60 * 1000)
      );


    let message =
      "You have already completed this event.";


    if (remainingHours > 0) {

      message +=
        ` You can play again in ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`;

      if (remainingMinutes > 0) {
        message +=
          ` ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}`;
      }

      message += ".";

    } else {

      message +=
        ` You can play again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`;
    }


    showError(message);

    return false;
  }


  return true;
}


/* =========================================
   LOAD ASSIGNED PUZZLES
========================================= */

async function loadAssignedPuzzles(
  assignedPuzzles,
  requiredCount
) {

  const loadedPuzzles = [];


  for (const assignedPuzzle of assignedPuzzles) {

    if (!assignedPuzzle?.puzzleId) {
      continue;
    }


    try {

     const puzzleRef = doc(
  db,
  "puzzleEventPuzzles",
  assignedPuzzle.puzzleId
);

      const puzzleSnapshot =
        await getDoc(puzzleRef);


      if (!puzzleSnapshot.exists()) {
        continue;
      }


      const puzzle =
        puzzleSnapshot.data();


      loadedPuzzles.push({

        id: puzzleSnapshot.id,

        ...puzzle,

        eventPoints:
          getAssignedPoints(assignedPuzzle)

      });

    } catch (error) {

      console.error(
        "Error loading puzzle:",
        assignedPuzzle.puzzleId,
        error
      );

    }

  }


  /* -----------------------------------------
     RANDOMIZE
  ----------------------------------------- */

  shuffleArray(loadedPuzzles);


  /* -----------------------------------------
     SELECT REQUIRED NUMBER
  ----------------------------------------- */

  selectedPuzzles =
    loadedPuzzles.slice(
      0,
      requiredCount
    );
}


/* =========================================
   SHUFFLE
========================================= */

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      array[i],
      array[j]
    ] = [
      array[j],
      array[i]
    ];

  }

}


/* =========================================
   START PUZZLE
========================================= */

function startPuzzle() {

  clearPuzzleTimer();


  if (
    currentPuzzleIndex >=
    selectedPuzzles.length
  ) {

    finishEvent();

    return;
  }


  currentPuzzle =
    selectedPuzzles[currentPuzzleIndex];
  console.log(
  "🧩 Current Puzzle:",
  currentPuzzleIndex + 1,
  currentPuzzle
);

console.log(
  "🖼️ Current Puzzle Image:",
  getPuzzleImageUrl(currentPuzzle)
);


  hasSubmitted = false;


  currentPuzzleNumber.textContent =
    currentPuzzleIndex + 1;


  totalPuzzleNumber.textContent =
    selectedPuzzles.length;


  puzzlePoints.textContent =
    currentPuzzle.eventPoints;


  puzzleAnswer.value = "";


  answerStatus.textContent =
    "";


  puzzleImage.src =
    getPuzzleImageUrl(currentPuzzle);


  puzzleImage.alt =
    "Chess puzzle";


  if (!getPuzzleImageUrl(currentPuzzle)) {

    answerStatus.textContent =
      "Puzzle image unavailable.";

  }


  submitPuzzleBtn.disabled =
    false;


  /* -----------------------------------------
     TIMER
  ----------------------------------------- */

  remainingSeconds =
    Number(
      eventData.timerSeconds || 30
    );


  updateTimerDisplay();


  timerInterval =
    setInterval(
      handleTimerTick,
      1000
    );


  puzzleAnswer.focus();

}


/* =========================================
   TIMER
========================================= */

function handleTimerTick() {

  remainingSeconds--;

  updateTimerDisplay();


  if (remainingSeconds <= 0) {

    clearPuzzleTimer();

    handleTimeExpired();
  }

}


function updateTimerDisplay() {

  puzzleTimer.textContent =
    Math.max(
      0,
      remainingSeconds
    );


  if (remainingSeconds <= 5) {

    puzzleTimer.classList.add(
      "timer-danger"
    );

  } else {

    puzzleTimer.classList.remove(
      "timer-danger"
    );

  }

}


function clearPuzzleTimer() {

  if (timerInterval) {

    clearInterval(
      timerInterval
    );

    timerInterval = null;

  }

}


/* =========================================
   TIMER EXPIRED
========================================= */

function handleTimeExpired() {

  if (hasSubmitted) {
    return;
  }


  hasSubmitted = true;

  submitPuzzleBtn.disabled =
    true;

  puzzleAnswer.disabled =
    true;


  /*
    No correctness message is shown.
    The puzzle simply moves forward.
  */

  answerStatus.textContent =
    "Time's up. Moving to the next puzzle...";


  setTimeout(
    () => {

      puzzleAnswer.disabled =
        false;

      currentPuzzleIndex++;

      startPuzzle();

    },
    900
  );

}


/* =========================================
   SUBMIT ANSWER
========================================= */

async function submitAnswer() {

  if (hasSubmitted) {
    return;
  }


  const answer =
    puzzleAnswer.value.trim();


  if (!answer) {

    answerStatus.textContent =
      "Please enter your answer.";

    return;
  }


  hasSubmitted = true;


  clearPuzzleTimer();


  submitPuzzleBtn.disabled =
    true;

  puzzleAnswer.disabled =
    true;


  /* -----------------------------------------
     CHECK ANSWER
  ----------------------------------------- */

  const submittedAnswer =
    normalizeAnswer(answer);


  const correctMove =
    normalizeAnswer(
      currentPuzzle.correctMove
    );


  const isCorrect =
    submittedAnswer === correctMove;


  if (isCorrect) {

    currentScore +=
      Number(
        currentPuzzle.eventPoints || 0
      );

    correctAnswers++;

  }


  /* -----------------------------------------
     SAVE INDIVIDUAL ANSWER
  ----------------------------------------- */

  const user =
    auth.currentUser;


  try {

    await addDoc(
      collection(
        db,
        "puzzleEventAnswers"
      ),
      {

        eventId,

        eventName:
          eventData.title || "",

        userId:
          user.uid,

        puzzleId:
          currentPuzzle.id,

        puzzleNumber:
          currentPuzzleIndex + 1,

        answer,

        correct:
          isCorrect,

        points:
          isCorrect
            ? Number(
                currentPuzzle.eventPoints || 0
              )
            : 0,

        createdAt:
          serverTimestamp()

      }
    );

  } catch (error) {

    console.error(
      "Error saving puzzle event answer:",
      error
    );

  }


  currentScoreElement.textContent =
    currentScore;


  /*
    IMPORTANT:
    We deliberately DO NOT tell the player
    whether the answer was correct.
  */

  answerStatus.textContent =
    "Answer submitted. Moving to the next puzzle...";


  setTimeout(
    () => {

      puzzleAnswer.disabled =
        false;

      currentPuzzleIndex++;

      startPuzzle();

    },
    900
  );

}


/* =========================================
   FINISH EVENT
========================================= */

async function finishEvent() {

  clearPuzzleTimer();


  const user =
    auth.currentUser;


  if (!user) {

    showError(
      "Your session has expired. Please log in again."
    );

    return;
  }


  submitPuzzleBtn.disabled =
    true;


  /* -----------------------------------------
     SAVE RESULT
  ----------------------------------------- */

  try {

    await addDoc(
      collection(
        db,
        "puzzleEventResults"
      ),
      {

        eventId,

        eventName:
          eventData.title || "",

        userId:
          user.uid,

        score:
          currentScore,

        correctAnswers,

        totalPuzzles:
          selectedPuzzles.length,

        completedAt:
          serverTimestamp()

      }
    );


  } catch (error) {

    console.error(
      "Error saving event result:",
      error
    );

  }


  /* -----------------------------------------
     RECORD STREAK
  ----------------------------------------- */

  try {

    await recordUserActivity(
      "puzzleEvent",
      eventId
    );

  } catch (error) {

    console.error(
      "Error recording puzzle event activity:",
      error
    );

  }


  /* -----------------------------------------
     SHOW RESULT
  ----------------------------------------- */

  gameContainer.classList.add(
    "hidden"
  );


  resultContainer.classList.remove(
    "hidden"
  );


  finalScore.textContent =
    currentScore;


  finalCorrect.textContent =
    correctAnswers;


  finalTotal.textContent =
    selectedPuzzles.length;


  backToEventBtn.href =
    `puzzle-event.html?event=${encodeURIComponent(eventId)}`;

}


/* =========================================
   BUTTON EVENTS
========================================= */

if (submitPuzzleBtn) {

  submitPuzzleBtn.addEventListener(
    "click",
    submitAnswer
  );

}


/* =========================================
   ENTER KEY
========================================= */

if (puzzleAnswer) {

  puzzleAnswer.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        submitAnswer();

      }

    }
  );

}


/* =========================================
   INITIALIZE
========================================= */

loadEvent()
  .catch((error) => {

    console.error(
      "❌ Error starting Puzzle Event:",
      error
    );

    showError(
      "Something went wrong while preparing the event."
    );

  });
