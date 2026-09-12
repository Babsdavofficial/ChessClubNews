import { auth, db } from "./firebase.js";
import { getAchievementLevel } from "./achievement.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


/* =========================
   ELEMENTS
========================= */

const profileLoading = document.getElementById("profileLoading");
const profileContent = document.getElementById("profileContent");

const playerName = document.getElementById("playerName");
const playerEmail = document.getElementById("playerEmail");

const playerLevelBadge = document.getElementById("playerLevelBadge");
const playerLevelIcon = document.getElementById("playerLevelIcon");
const playerLevelName = document.getElementById("playerLevelName");
const playerLevelNumber = document.getElementById("playerLevelNumber");

const profileFantasyPoints =
  document.getElementById("profileFantasyPoints");

const nextLevelText =
  document.getElementById("nextLevelText");

const profileTrivia =
  document.getElementById("profileTrivia");

const profilePredictions =
  document.getElementById("profilePredictions");

const profilePuzzles =
  document.getElementById("profilePuzzles");

const profileStreak =
  document.getElementById("profileStreak");

const achievementsContainer =
  document.getElementById("achievementsContainer");

const searchPlayerBtn =
  document.getElementById("searchPlayerBtn");

const searchPanel =
  document.getElementById("searchPanel");

const closeSearchBtn =
  document.getElementById("closeSearchBtn");

const playerSearchInput =
  document.getElementById("playerSearchInput");

const playerSearchResults =
  document.getElementById("playerSearchResults");


/* =========================
   ACHIEVEMENT LEVEL COLORS
========================= */

function applyLevelStyle(element, achievement) {
  if (!element || !achievement) return;

  element.className = element.className
    .replace(/\bleague-\S+/g, "")
    .trim();

  element.classList.add(achievement.className);
}


/* =========================
   NEXT LEVEL
========================= */

function updateNextLevel(points) {
  const current = getAchievementLevel(points);

  const levels = [
    { points: 200, name: "Stone" },
    { points: 500, name: "Bronze" },
    { points: 800, name: "Iron" },
    { points: 1100, name: "Silver" },
    { points: 1400, name: "Hunter" },
    { points: 1700, name: "Gold" },
    { points: 2000, name: "Platinum" },
    { points: 2300, name: "Diamond" },
    { points: 2600, name: "Elite" },
    { points: 2900, name: "Master" },
    { points: 3200, name: "Grandmaster" },
    { points: 3500, name: "Champion" },
    { points: 3800, name: "Immortal" },
    { points: 4100, name: "Legendary" }
  ];

  const next = levels.find(level => level.points > points);

  if (!next) {
    nextLevelText.textContent =
      "You have reached the highest achievement level.";
    return;
  }

  const remaining = next.points - points;

  nextLevelText.textContent =
    `${remaining} FP needed for ${next.name}`;
}


/* =========================
   DISPLAY PROFILE
========================= */

function displayProfile(userData, uid) {
  const username =
    userData.username || "Chess Player";

  const email =
    userData.email || "";

  const fantasyPoints =
    Number(userData.fantasyPoints) || 0;

  const triviaCorrect =
    Number(userData.triviaCorrect) || 0;

  const predictionScore =
    Number(userData.predictionScore) || 0;

  /*
    These two may not exist in the users
    collection yet, so they safely show 0.
  */
  const puzzleStats =
    Number(userData.puzzleCorrect) || 0;

  const streak =
    Number(userData.streak) || 0;


  /* NAME */

  playerName.textContent = username;

  /*
    For now we display the email.
    We can change this later if you want
    public profiles to hide email addresses.
  */
  playerEmail.textContent = email;


  /* LEVEL */

  const achievement =
    getAchievementLevel(fantasyPoints);

  playerLevelIcon.textContent =
    achievement.icon;

  playerLevelName.textContent =
    achievement.name;

  playerLevelNumber.textContent =
    `Level ${achievement.level}`;

  applyLevelStyle(playerLevelBadge, achievement);


  /* FANTASY POINTS */

  profileFantasyPoints.textContent =
    fantasyPoints.toLocaleString();

  updateNextLevel(fantasyPoints);


  /* STATS */

  profileTrivia.textContent =
    triviaCorrect;

  profilePredictions.textContent =
    predictionScore;

  profilePuzzles.textContent =
    puzzleStats;

  profileStreak.textContent =
    streak;


  /* ACHIEVEMENTS */

  achievementsContainer.innerHTML = `
    <div class="achievement-empty">
      <div class="achievement-empty-icon">🏆</div>
      <h3>Achievements Coming Soon</h3>
      <p>
        Milestone achievements, event awards and special
        accomplishments will appear here.
      </p>
    </div>
  `;


  /* SHOW PROFILE */

  profileLoading.style.display = "none";
  profileContent.style.display = "block";


  /*
    Save the selected player in the URL.
    This allows the profile to be shared later.
  */
  const url =
    new URL(window.location.href);

  url.searchParams.set("user", uid);

  window.history.replaceState({}, "", url);
}


/* =========================
   LOAD USER
========================= */

async function loadProfile(uid) {
  try {
    profileLoading.style.display = "block";
    profileContent.style.display = "none";

    const userRef =
      doc(db, "users", uid);

    const userSnap =
      await getDoc(userRef);

    if (!userSnap.exists()) {
      profileLoading.innerHTML = `
        <div class="error-message">
          <h3>Player not found</h3>
          <p>This player profile does not exist.</p>
        </div>
      `;
      return;
    }

    displayProfile(
      userSnap.data(),
      uid
    );

  } catch (error) {
    console.error(
      "Error loading profile:",
      error
    );

    profileLoading.innerHTML = `
      <div class="error-message">
        <h3>Unable to load profile</h3>
        <p>Please try again.</p>
      </div>
    `;
  }
}


/* =========================
   SEARCH PANEL
========================= */

searchPlayerBtn.addEventListener(
  "click",
  () => {
    searchPanel.classList.add("open");

    setTimeout(() => {
      playerSearchInput.focus();
    }, 200);
  }
);


closeSearchBtn.addEventListener(
  "click",
  () => {
    searchPanel.classList.remove("open");
  }
);


/* =========================
   LOAD PLAYERS FOR SEARCH
========================= */

let allPlayers = [];


async function loadPlayers() {
  try {
    const usersSnapshot =
      await getDocs(
        collection(db, "users")
      );

    allPlayers = [];

    usersSnapshot.forEach(snapshot => {
      const data = snapshot.data();

      allPlayers.push({
        uid: snapshot.id,
        username: data.username || "Chess Player"
      });
    });

  } catch (error) {
    console.error(
      "Error loading players:",
      error
    );
  }
}


/* =========================
   SEARCH PLAYERS
========================= */

playerSearchInput.addEventListener(
  "input",
  () => {

    const search =
      playerSearchInput.value
        .trim()
        .toLowerCase();

    playerSearchResults.innerHTML = "";

    if (!search) {
      return;
    }

    const matches =
      allPlayers.filter(player =>
        player.username
          .toLowerCase()
          .includes(search)
      );

    if (matches.length === 0) {
      playerSearchResults.innerHTML = `
        <div class="search-empty">
          No player found.
        </div>
      `;
      return;
    }

    matches.forEach(player => {

      const result =
        document.createElement("button");

      result.className =
        "player-search-result";

      result.innerHTML = `
        <span class="search-player-icon">♟</span>
        <span>${player.username}</span>
      `;

      result.addEventListener(
        "click",
        () => {

          loadProfile(player.uid);

          searchPanel.classList.remove("open");

          playerSearchInput.value = "";

          playerSearchResults.innerHTML = "";
        }
      );

      playerSearchResults.appendChild(result);
    });
  }
);


/* =========================
   AUTHENTICATION
========================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    /*
      If URL contains ?user=UID,
      load that player's profile.

      Otherwise load the currently
      logged-in user's profile.
    */

    const params =
      new URLSearchParams(
        window.location.search
      );

    const requestedUser =
      params.get("user");

    const profileUid =
      requestedUser || user.uid;

    await loadProfile(profileUid);

    /*
      Load players for the search system.
    */
    await loadPlayers();
  }
);
