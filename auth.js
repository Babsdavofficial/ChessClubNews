import { auth, db } from "./firebase.js";
// Import Firebase services
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =====================================================
// ACHIEVEMENT / FANTASY POINT LEVEL SYSTEM
// =====================================================

function getAchievementLevel(points) {

  points = Number(points) || 0;

  if (points >= 4100) {
    return {
      level: 15,
      name: "Legendary",
      icon: "👑",
      className: "league-legendary"
    };
  }

  if (points >= 3800) {
    return {
      level: 14,
      name: "Immortal",
      icon: "🌟",
      className: "league-immortal"
    };
  }

  if (points >= 3500) {
    return {
      level: 13,
      name: "Champion",
      icon: "⚡",
      className: "league-champion"
    };
  }

  if (points >= 3200) {
    return {
      level: 12,
      name: "Grandmaster",
      icon: "🐉",
      className: "league-grandmaster"
    };
  }

  if (points >= 2900) {
    return {
      level: 11,
      name: "Master",
      icon: "👑",
      className: "league-master"
    };
  }

  if (points >= 2600) {
    return {
      level: 10,
      name: "Elite",
      icon: "🔥",
      className: "league-elite"
    };
  }

  if (points >= 2300) {
    return {
      level: 9,
      name: "Diamond",
      icon: "💎",
      className: "league-diamond"
    };
  }

  if (points >= 2000) {
    return {
      level: 8,
      name: "Platinum",
      icon: "💠",
      className: "league-platinum"
    };
  }

  if (points >= 1700) {
    return {
      level: 7,
      name: "Gold",
      icon: "🥇",
      className: "league-gold"
    };
  }

  if (points >= 1400) {
    return {
      level: 6,
      name: "Hunter",
      icon: "🏹",
      className: "league-hunter"
    };
  }

  if (points >= 1100) {
    return {
      level: 5,
      name: "Silver",
      icon: "🥈",
      className: "league-silver"
    };
  }

  if (points >= 800) {
    return {
      level: 4,
      name: "Iron",
      icon: "⚔️",
      className: "league-iron"
    };
  }

  if (points >= 500) {
    return {
      level: 3,
      name: "Bronze",
      icon: "🥉",
      className: "league-bronze"
    };
  }

  if (points >= 200) {
    return {
      level: 2,
      name: "Stone",
      icon: "🪨",
      className: "league-stone"
    };
  }

  return {
    level: 1,
    name: "Wood",
    icon: "🪵",
    className: "league-wood"
  };

}


// =====================================================
// DISPLAY USER ACHIEVEMENT IN PROFILE
// =====================================================

function updateProfileAchievement(userData) {

  const achievementDiv =
    document.getElementById("profileAchievement");

  const badgeDiv =
    document.getElementById("profileAchievementBadge");

  const nameDiv =
    document.getElementById("profileAchievementName");

  const levelDiv =
    document.getElementById("profileAchievementLevel");

  const pointsDiv =
    document.getElementById("fantasyPoints");

  if (
    !achievementDiv ||
    !badgeDiv ||
    !nameDiv ||
    !levelDiv
  ) {
    return;
  }

  const points =
    Number(userData?.fantasyPoints) || 0;

  const achievement =
    getAchievementLevel(points);

  badgeDiv.textContent =
    achievement.icon;

  nameDiv.textContent =
    achievement.name;

  levelDiv.textContent =
    `Level ${achievement.level}`;

  if (pointsDiv) {
    pointsDiv.textContent =
      points;
  }

  achievementDiv.className =
    `profile-achievement ${achievement.className}`;
}
// Get form elements
const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Simple validation
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Create Firebase Authentication account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Save additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        fantasyPoints: 0,
        triviaCorrect: 0,
        predictionScore: 0,
        role: "user",
        createdAt: new Date()
      });

      alert("🎉 Account created successfully!");

      // Redirect to login page
      window.location.href = "login.html";

    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    }

  });
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("🎉 Login successful!");

      // Go to the main page after login
      window.location.href = "index.html";

    } catch (error) {
      alert("Login failed: " + error.message);
      console.error(error);
    }

  });
}

// KEEP USER LOGGED IN
// KEEP USER LOGGED IN

onAuthStateChanged(auth, async (user) => {

  const userDisplay = document.getElementById("userDisplay");
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const fantasyPoints = document.getElementById("fantasyPoints");
  const triviaScore = document.getElementById("triviaScore");
  const predictionScore = document.getElementById("predictionScore");
  const adminPanelBtn = document.getElementById("adminPanelBtn");

  if (user) {

    try {

  const userRef = doc(db, "users", user.uid);

onSnapshot(userRef, (userSnap) => {

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    if (userDisplay)
        userDisplay.textContent = `👤 ${userData.username}`;

    if (profileName)
        profileName.textContent = userData.username;

    if (profileEmail)
        profileEmail.textContent = userData.email;

    if (fantasyPoints)
        fantasyPoints.textContent = userData.fantasyPoints || 0;
  // =====================================================
// UPDATE FANTASY ACHIEVEMENT
// =====================================================
updateProfileAchievement(userData);

    if (triviaScore)
        triviaScore.textContent = userData.triviaCorrect || 0;

    if (predictionScore)
        predictionScore.textContent = userData.predictionScore || 0;

    if (adminPanelBtn) {

        if (userData.role === "admin") {

            adminPanelBtn.style.display = "block";

            adminPanelBtn.onclick = () => {
                window.location.href = "admin.html";
            };

        } else {

            adminPanelBtn.style.display = "none";

        }

    }

});


      if (loginLink)
        loginLink.style.display = "none";

      if (logoutBtn)
        logoutBtn.style.display = "inline-block";

    } catch (error) {

      console.error(error);

    }

  } else {

    if (userDisplay)
      userDisplay.textContent = "👤 Guest";

    if (loginLink)
      loginLink.style.display = "inline-block";

    if (logoutBtn)
      logoutBtn.style.display = "none";

  }

});

// LOGOUT

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      window.location.href = "login.html";

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  });

}

// PROFILE DROPDOWN

const profileBtn =
  document.getElementById("profileBtn");

const profileDropdown =
  document.getElementById("profileDropdown");

if (profileBtn && profileDropdown) {

  profileBtn.addEventListener("click", () => {

    if (
      profileDropdown.style.display === "block"
    ) {

      profileDropdown.style.display = "none";

    } else {

      profileDropdown.style.display = "block";

    }

  });

  document.addEventListener("click", (event) => {

    if (
      !profileBtn.contains(event.target) &&
      !profileDropdown.contains(event.target)
    ) {

      profileDropdown.style.display = "none";

    }

  });

}
