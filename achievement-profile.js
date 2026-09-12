
import { auth, db } from "./firebase.js";

import {
  getAchievementLevel,
  syncDefaultAchievements,
  getUserAchievements
} from "./achievement.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   ELEMENTS
========================= */

const profileLoading =
  document.getElementById("profileLoading");

const profileContent =
  document.getElementById("profileContent");

const playerName =
  document.getElementById("playerName");

const playerEmail =
  document.getElementById("playerEmail");

const playerLevelBadge =
  document.getElementById("playerLevelBadge");

const playerLevelIcon =
  document.getElementById("playerLevelIcon");

const playerLevelName =
  document.getElementById("playerLevelName");

const playerLevelNumber =
  document.getElementById("playerLevelNumber");

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

  element.classList.add(
    achievement.className
  );
}


/* =========================
   NEXT LEVEL
========================= */

function updateNextLevel(points) {

  const current =
    getAchievementLevel(points);

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

  const next =
    levels.find(
      level => level.points > points
    );

  if (!next) {
    nextLevelText.textContent =
      "You have reached the highest achievement level.";

    return;
  }

  const remaining =
    next.points - points;

  nextLevelText.textContent =
    `${remaining} FP needed for ${next.name}`;
}


/* =========================
   FORMAT ACHIEVEMENT DATE
========================= */

function formatAchievementDate(earnedAt) {

  if (!earnedAt) {
    return "";
  }

  let date;

  if (
    earnedAt &&
    typeof earnedAt.toDate === "function"
  ) {
    date = earnedAt.toDate();
  } else {
    date = new Date(earnedAt);
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


/* =========================
   DISPLAY ACHIEVEMENTS
========================= */

function displayAchievements(
  achievements
) {

  if (!achievementsContainer) {
    return;
  }

  achievementsContainer.innerHTML = "";

  if (!achievements.length) {

    achievementsContainer.innerHTML = `
      <div class="achievement-empty">
        <div class="achievement-empty-icon">🏆</div>

        <h3>No Achievements Yet</h3>

        <p>
          Keep participating in Chess News Hub
          activities to earn your first achievement.
        </p>
      </div>
    `;

    return;
  }

  /*
   * Sort achievements so the newest
   * achievements appear first.
   */
  achievements.sort((a, b) => {

    const aTime =
      a.earnedAt?.toMillis
        ? a.earnedAt.toMillis()
        : 0;

    const bTime =
      b.earnedAt?.toMillis
        ? b.earnedAt.toMillis()
        : 0;

    return bTime - aTime;
  });


  achievements.forEach(
    achievement => {

      const card =
  document.createElement("div");

card.className =
  "achievement-card";

card.dataset.category =
  achievement.category || achievement.type || "default";

      const earnedDate =
        formatAchievementDate(
          achievement.earnedAt
        );

      card.innerHTML = `
        <div class="achievement-card-icon">
          ${achievement.icon || "🏆"}
        </div>

        <div class="achievement-card-content">

          <h3>
            ${achievement.name || "Achievement"}
          </h3>

          <p>
            ${
              achievement.description ||
              "Achievement unlocked."
            }
          </p>

          ${
            earnedDate
              ? `
                <span class="achievement-earned-date">
                  Earned ${earnedDate}
                </span>
              `
              : ""
          }

        </div>
      `;

      achievementsContainer.appendChild(
        card
      );
    }
  );
}


/* =========================
   LOAD ACHIEVEMENTS
========================= */

async function loadAchievements(
  uid,
  userData
) {

  try {

    /*
     * First check all permanent/default
     * achievements.
     *
     * This also handles users who reached
     * a milestone before the achievement
     * system was created.
     */
    await syncDefaultAchievements(
      uid,
      {
        ...userData,

        /*
         * Streak achievements use the
         * highest streak ever.
         */
        streak:
          Number(userData.highestStreak) ||
          Number(userData.streak) ||
          0
      }
    );


    /*
     * Now load everything the user has
     * permanently earned.
     */
    const achievements =
      await getUserAchievements(uid);


    displayAchievements(
      achievements
    );

  } catch (error) {

    console.error(
      "Error loading achievements:",
      error
    );

    achievementsContainer.innerHTML = `
      <div class="achievement-empty">

        <div class="achievement-empty-icon">
          ⚠️
        </div>

        <h3>
          Unable to load achievements
        </h3>

        <p>
          Please refresh the page and try again.
        </p>

      </div>
    `;
  }
}


/* =========================
   DISPLAY PROFILE
========================= */

async function displayProfile(
  userData,
  uid
) {

  const username =
    userData.username ||
    "Chess Player";

  const email =
    userData.email ||
    "";

  const fantasyPoints =
    Number(userData.fantasyPoints) ||
    0;

  const triviaCorrect =
    Number(userData.triviaCorrect) ||
    0;

  const predictionScore =
    Number(userData.predictionScore) ||
    0;

  const puzzleStats =
    Number(userData.puzzleCorrect) ||
    0;

  const currentStreak =
    Number(userData.streak) ||
    0;

  /*
   * Highest streak is used for achievement
   * purposes, while the profile still shows
   * the user's current streak.
   */
  const highestStreak =
    Number(userData.highestStreak) ||
    currentStreak;


  /* =========================
     BASIC PROFILE
  ========================= */

  playerName.textContent =
    username;

  playerEmail.textContent =
    email;


  /* =========================
     ACHIEVEMENT LEVEL
  ========================= */

  const achievement =
    getAchievementLevel(
      fantasyPoints
    );

  playerLevelIcon.textContent =
    achievement.icon;

  playerLevelName.textContent =
    achievement.name;

  playerLevelNumber.textContent =
    `Level ${achievement.level}`;

  applyLevelStyle(
    playerLevelBadge,
    achievement
  );


  /* =========================
     PROFILE STATS
  ========================= */

  profileFantasyPoints.textContent =
    fantasyPoints.toLocaleString();

  updateNextLevel(
    fantasyPoints
  );

  profileTrivia.textContent =
    triviaCorrect;

  profilePredictions.textContent =
    predictionScore;

  profilePuzzles.textContent =
    puzzleStats;

  profileStreak.textContent =
    currentStreak;


  /* =========================
     ACHIEVEMENTS
  ========================= */

  await loadAchievements(
    uid,
    {
      ...userData,

      /*
       * Make sure the achievement
       * system receives the highest
       * streak value.
       */
      highestStreak:
        highestStreak
    }
  );


  /* =========================
     PROFILE VISIBILITY
  ========================= */

  profileLoading.style.display =
    "none";

  profileContent.style.display =
    "block";


  /* =========================
     UPDATE URL
  ========================= */

  const url =
    new URL(
      window.location.href
    );

  url.searchParams.set(
    "user",
    uid
  );

  window.history.replaceState(
    {},
    "",
    url
  );
}


/* =========================
   LOAD USER
========================= */

async function loadProfile(uid) {

  try {

    profileLoading.style.display =
      "block";

    profileContent.style.display =
      "none";


    const userRef =
      doc(
        db,
        "users",
        uid
      );

    const userSnap =
      await getDoc(
        userRef
      );


    if (!userSnap.exists()) {

      profileLoading.innerHTML = `
        <div class="error-message">

          <h3>
            Player not found
          </h3>

          <p>
            This player profile does not exist.
          </p>

        </div>
      `;

      return;
    }


    await displayProfile(
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

        <h3>
          Unable to load profile
        </h3>

        <p>
          Please try again.
        </p>

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

    searchPanel.classList.add(
      "open"
    );

    setTimeout(
      () => {
        playerSearchInput.focus();
      },
      200
    );
  }
);


closeSearchBtn.addEventListener(
  "click",
  () => {

    searchPanel.classList.remove(
      "open"
    );
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
        collection(
          db,
          "users"
        )
      );


    allPlayers = [];


    usersSnapshot.forEach(
      snapshot => {

        const data =
          snapshot.data();

        allPlayers.push({

          uid:
            snapshot.id,

          username:
            data.username ||
            "Chess Player"

        });
      }
    );

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


    playerSearchResults.innerHTML =
      "";


    if (!search) {
      return;
    }


    const matches =
      allPlayers.filter(
        player =>
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


    matches.forEach(
      player => {

        const result =
          document.createElement(
            "button"
          );

        result.className =
          "player-search-result";


        result.innerHTML = `
          <span class="search-player-icon">
            ♟
          </span>

          <span>
            ${player.username}
          </span>
        `;


        result.addEventListener(
          "click",
          () => {

            loadProfile(
              player.uid
            );

            searchPanel.classList.remove(
              "open"
            );

            playerSearchInput.value =
              "";

            playerSearchResults.innerHTML =
              "";
          }
        );


        playerSearchResults.appendChild(
          result
        );
      }
    );
  }
);


/* =========================
   AUTHENTICATION
========================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;
    }


    const params =
      new URLSearchParams(
        window.location.search
      );


    const requestedUser =
      params.get("user");


    const profileUid =
      requestedUser ||
      user.uid;


    await loadProfile(
      profileUid
    );


    await loadPlayers();
  }
);

