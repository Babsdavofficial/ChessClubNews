
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
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
onAuthStateChanged(auth, async (user) => {

  const userDisplay = document.getElementById("userDisplay");
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    console.log("User logged in:", user.email);

    // Get user profile from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      if (userDisplay) {
        userDisplay.textContent = `👤 ${data.username}`;
      }
    }

    if (loginLink) {
      loginLink.style.display = "none";
    }

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
    }

  } else {

    if (userDisplay) {
      userDisplay.textContent = "Guest";
    }

    if (loginLink) {
      loginLink.style.display = "inline-block";
    }

    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }

  }
});

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
}











