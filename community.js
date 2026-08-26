import { db, auth } from "./firebase.js";
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
  writeBatch,
  limit,
  Timestamp

}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


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
const predictionsContainer =
document.getElementById("predictionsContainer");

async function loadPredictions(){

if(!predictionsContainer) return;

predictionsContainer.innerHTML="Loading predictions...";

const q=query(

collection(db,"predictions"),

where("active","==",true),

orderBy("createdAt","desc")

);

const snapshot=await getDocs(q);

predictionsContainer.innerHTML="";

snapshot.forEach(async(docSnap)=>{

const prediction=docSnap.data();

const predictionId=docSnap.id;

const user=auth.currentUser;

let alreadyVoted=false;

let votedOption="";

if(user){

const voteRef=doc(

db,

"predictionVotes",

`${predictionId}_${user.uid}`

);

const voteSnap=await getDoc(voteRef);

if(voteSnap.exists()){

alreadyVoted=true;

votedOption=voteSnap.data().choice;

}

}

const closed=

prediction.closesAt.toDate()<new Date();

predictionsContainer.innerHTML+=`

<div class="card" style="background:linear-gradient(135deg, rgba(239,68,68,.18), rgba(124,58,237,.20), rgba(37,99,235,.18)); border:1px solid rgba(139,92,246,.35); color:white;">

<div class="chip">

Prediction

</div>

<h3>

${prediction.title}

</h3>

${
prediction.options.map(option=>`

<label>

<input

type="radio"

name="prediction-${predictionId}"

value="${option}"

${alreadyVoted||closed?"disabled":""}

>

${option}

</label>

<br><br>

`).join("")
}

${
alreadyVoted?

`<p style="color:lime;">
✅ You voted:
<strong>${votedOption}</strong>
</p>`

:

closed?

`<p style="color:red;">
Voting Closed
</p>`

:

`<button

class="btn primary submitPredictionBtn"

data-id="${predictionId}"

>

Submit Prediction

</button>`

}

</div>

`;

});

}

loadPredictions();

document.addEventListener(

"click",

async(e)=>{

if(!e.target.classList.contains("submitPredictionBtn"))

return;

const user=auth.currentUser;

if(!user){

alert("Login first.");

return;

}

const predictionId=

e.target.dataset.id;

const selected=

document.querySelector(

`input[name="prediction-${predictionId}"]:checked`

);

if(!selected){

alert("Choose an option.");

return;

}

const voteRef=

doc(

db,

"predictionVotes",

`${predictionId}_${user.uid}`

);

const exists=

await getDoc(voteRef);

if(exists.exists()){

alert("Already voted.");

return;

}

await setDoc(

voteRef,

{

predictionId,

userId:user.uid,

choice:selected.value,

createdAt:Timestamp.now()

}

);

alert("Prediction submitted.");

loadPredictions();

});

// =========================
// CREATE PREDICTION
// =========================

const createPredictionBtn =
  document.getElementById("createPredictionBtn");

if (createPredictionBtn) {

  createPredictionBtn.addEventListener(
    "click",
    async () => {

      const title =
        document.getElementById("predictionTitle").value.trim();

      const option1 =
        document.getElementById("predictionOption1").value.trim();

      const option2 =
        document.getElementById("predictionOption2").value.trim();

      const option3 =
        document.getElementById("predictionOption3").value.trim();

      const closeTime =
        document.getElementById("predictionCloseTime").value;

      if (
        !title ||
        !option1 ||
        !option2 ||
        !option3 ||
        !closeTime
      ) {

        alert("Please fill all fields.");

        return;

      }

      try {

        await addDoc(
          collection(db, "predictions"),
          {

            title,

            options: [
              option1,
              option2,
              option3
            ],

            active: true,

            closeAt: Timestamp.fromDate(
              new Date(closeTime)
            ),

            createdAt: serverTimestamp(),

            correctOption: ""

          }
        );

        alert("✅ Prediction created.");

        document.getElementById("predictionTitle").value = "";
        document.getElementById("predictionOption1").value = "";
        document.getElementById("predictionOption2").value = "";
        document.getElementById("predictionOption3").value = "";
        document.getElementById("predictionCloseTime").value = "";

      }

      catch (error) {

        console.error(error);

        alert("Failed to create prediction.");

      }

    }

  );

}
// =========================
// LOAD TRIVIA
// =========================

let selectedTrivia = null;

async function loadTrivia(){

try{

const snapshot = await getDocs(

query(

collection(db,"trivia"),

where("active","==",true),

orderBy("createdAt","desc"),

limit(1)

)

);

console.log(snapshot.size);

if(snapshot.empty){

document.getElementById("triviaContainer").textContent =
"No trivia available.";

return;

}

const triviaDoc=snapshot.docs[0];

selectedTrivia={
id:triviaDoc.id,
...triviaDoc.data()
};

console.log(selectedTrivia);

document.getElementById("triviaContainer").innerHTML=

`<h3>${selectedTrivia.question}</h3>`;

const optionsDiv=document.getElementById("triviaOptions");

optionsDiv.innerHTML="";

selectedTrivia.options.forEach(option=>{

optionsDiv.innerHTML+=`

<label>

<input
type="radio"
name="triviaOption"
value="${option}">

${option}

</label>

<br><br>

`;

});

}catch(error){

console.error(error);

}

}

loadTrivia();

// =========================
// SUBMIT TRIVIA
// =========================

document

.getElementById("submitTriviaBtn")

.addEventListener("click",async()=>{

const user = auth.currentUser;

if(!user){

alert("Login first.");

return;

}

if(!selectedTrivia) return;

const answer = document.querySelector(

'input[name="triviaOption"]:checked'

);

if(!answer){

alert("Choose an answer.");

return;

}

const alreadyAnswered = await getDocs(

query(

collection(db,"triviaAnswers"),

where("triviaId","==",selectedTrivia.id),

where("userId","==",user.uid)

)

);

if(!alreadyAnswered.empty){

alert("You already answered.");

return;

}

await addDoc(

collection(db,"triviaAnswers"),

{

triviaId:selectedTrivia.id,

userId:user.uid,

answer:answer.value,

createdAt:serverTimestamp()

}

);

document.getElementById("triviaStatus")

.textContent = "✅ Answer submitted.";

});
// =========================
// LOAD PUZZLE
// =========================

let selectedPuzzle = null;

async function loadPuzzle(){

const snapshot = await getDocs(

query(

collection(db,"puzzles"),

where("active","==",true),

orderBy("createdAt","desc"),

limit(1)

)

);

if(snapshot.empty){

document.getElementById("puzzleContainer").innerHTML =
"No puzzle available.";

return;

}

const puzzleDoc = snapshot.docs[0];

selectedPuzzle = {

id:puzzleDoc.id,

...puzzleDoc.data()

};

document.getElementById("puzzleContainer").innerHTML = `

<h3>${selectedPuzzle.title}</h3>

<img
src="${selectedPuzzle.imageUrl}"
style="width:100%;border-radius:12px;margin:15px 0;">

`;

document.getElementById("puzzleAnswerArea").innerHTML = `

<input
type="text"
id="puzzleMove"
placeholder="Enter your best move..."
style="width:100%;padding:12px;border-radius:10px;">

`;

}

loadPuzzle();

// =========================
// SUBMIT PUZZLE
// =========================

document
.getElementById("submitPuzzleBtn")
.addEventListener("click", async()=>{

const user = auth.currentUser;

if(!user){

alert("Login first.");

return;

}

if(!selectedPuzzle) return;

const move =
document.getElementById("puzzleMove")
.value
.trim();

if(!move){

alert("Enter your move.");

return;

}

// Prevent multiple submissions

const alreadySolved = await getDocs(

query(

collection(db,"puzzleAnswers"),

where("puzzleId","==",selectedPuzzle.id),

where("userId","==",user.uid)

)

);

if(!alreadySolved.empty){

alert("You already submitted this puzzle.");

return;

}

await addDoc(

collection(db,"puzzleAnswers"),

{

puzzleId:selectedPuzzle.id,

userId:user.uid,

answer:move,

createdAt:serverTimestamp()

}

);

document.getElementById("puzzleStatus")
.textContent="✅ Puzzle submitted.";

});
// =========================
// LEADERBOARD
// =========================

async function loadLeaderboard(){

const fantasyDiv=
document.getElementById("fantasyLeaderboard");

const triviaDiv=
document.getElementById("triviaLeaderboard");

const predictionDiv=
document.getElementById("predictionLeaderboard");

if(
!fantasyDiv||
!triviaDiv||
!predictionDiv
)return;


// Fantasy

// =====================================================
// FANTASY LEADERBOARD
// =====================================================

const fantasySnapshot = await getDocs(

  query(

    collection(db, "fantasyTeams"),

    orderBy("fantasyPoints", "desc"),

    limit(10)

  )

);

fantasyDiv.innerHTML = "";

let rank = 1;


// -----------------------------------------
// LOAD EACH FANTASY TEAM
// -----------------------------------------

for (const teamDoc of fantasySnapshot.docs) {

  const team = teamDoc.data();

  let username = "Player";


  // -----------------------------------------
  // GET USER
  // -----------------------------------------

  if (team.userId) {

    const userRef =
      doc(
        db,
        "users",
        team.userId
      );

    const userSnap =
      await getDoc(userRef);

    if (userSnap.exists()) {

      const userData =
        userSnap.data();

      username =
        userData.username ||
        userData.fullname ||
        "Player";

    }

  }


  // -----------------------------------------
  // DISPLAY
  // -----------------------------------------

  fantasyDiv.innerHTML += `

    <p>

      <strong>
        ${rank}.
        ${username}
      </strong>

      <span style="float:right;">

        🏆 ${team.fantasyPoints || 0} FP

      </span>

    </p>

  `;

  rank++;

}


// -----------------------------------------
// NO FANTASY TEAMS
// -----------------------------------------

if (fantasySnapshot.empty) {

  fantasyDiv.innerHTML = `

    <p style="opacity:.7;">

      No Fantasy Teams yet.

    </p>

  `;

}




// Trivia

const triviaSnapshot=await getDocs(

query(

collection(db,"users"),

orderBy("triviaCorrect","desc"),

limit(10)

)

);

triviaDiv.innerHTML="";

rank=1;

triviaSnapshot.forEach(docSnap=>{

const user=docSnap.data();

triviaDiv.innerHTML+=`

<p>

${rank}. ${user.username}

<span style="float:right;">

${user.triviaCorrect||0}

</span>

</p>

`;

rank++;

});



// Prediction

const predictionSnapshot=await getDocs(

query(

collection(db,"users"),

orderBy("predictionScore","desc"),

limit(10)

)

);

predictionDiv.innerHTML="";

rank=1;

predictionSnapshot.forEach(docSnap=>{

const user=docSnap.data();

predictionDiv.innerHTML+=`

<p>

${rank}. ${user.username}

<span style="float:right;">

${user.predictionScore||0}

</span>

</p>

`;

rank++;

});

}

loadLeaderboard();

// =====================================================
// FANTASY TEAM — COMMUNITY
// =====================================================

let activeFantasyEvent = null;
let fantasyPlayers = [];
let selectedFantasyPlayers = [];


// =====================================================
// LOAD ACTIVE FANTASY EVENT
// =====================================================

async function loadFantasyEvent() {

  const titleDiv =
    document.getElementById("fantasyEventTitle");

  const budgetDiv =
    document.getElementById("fantasyBudgetDisplay");

  const remainingDiv =
    document.getElementById("fantasyRemainingBudget");

  const playersDiv =
    document.getElementById("fantasyPlayersContainer");

  if (
    !titleDiv ||
    !budgetDiv ||
    !remainingDiv ||
    !playersDiv
  ) {
    return;
  }

  try {

    const snapshot = await getDocs(

      query(

        collection(db, "fantasyEvents"),

        where("active", "==", true),

        limit(1)

      )

    );

    if (snapshot.empty) {

      titleDiv.textContent =
        "No Fantasy Event Available";

      budgetDiv.textContent = "0";
      remainingDiv.textContent = "0";

      playersDiv.innerHTML =
        "<p>No active Fantasy Event at the moment.</p>";

      return;
    }

    const eventDoc =
      snapshot.docs[0];

    activeFantasyEvent = {
      id: eventDoc.id,
      ...eventDoc.data()
    };

    titleDiv.textContent =
      `🏆 ${activeFantasyEvent.name}`;

    budgetDiv.textContent =
      activeFantasyEvent.budget;

    remainingDiv.textContent =
      activeFantasyEvent.budget;

    await loadFantasyPlayers();

    await loadMyFantasyTeam();

  }

  catch (error) {

    console.error(
      "Fantasy Event error:",
      error
    );

    titleDiv.textContent =
      "Failed to load Fantasy Event.";

  }

}


// =====================================================
// LOAD FANTASY PLAYERS
// =====================================================

async function loadFantasyPlayers() {

  const container =
    document.getElementById(
      "fantasyPlayersContainer"
    );

  if (!container || !activeFantasyEvent)
    return;

  container.innerHTML =
    "Loading Fantasy Players...";

  try {

    const snapshot =
      await getDocs(

        query(

          collection(
            db,
            "fantasyPlayers"
          ),

          where(
            "eventId",
            "==",
            activeFantasyEvent.id
          )

        )

      );

    fantasyPlayers = [];

    snapshot.forEach(
      (docSnap) => {

        fantasyPlayers.push({

          id: docSnap.id,

          ...docSnap.data()

        });

      }
    );

    if (!fantasyPlayers.length) {

      container.innerHTML =
        "<p>No Fantasy Players available yet.</p>";

      return;

    }

    container.innerHTML = "";

    fantasyPlayers.forEach(
      (player) => {

        container.innerHTML += `

          <div
            class="fact-item"
            style="margin-bottom:12px;">

            <label
              style="
                display:flex;
                align-items:center;
                gap:10px;
                cursor:pointer;
              ">

              <input
                type="checkbox"
                class="fantasyPlayerCheckbox"
                data-id="${player.id}"
                value="${player.id}">

              <span>

                <strong>
                  ${player.name}
                </strong>

                <br>

                💰 ${player.price}

                &nbsp;&nbsp;

                🏆 ${player.fantasyPoints || 0} FP

              </span>

            </label>

          </div>

        `;

      }
    );

  }

  catch (error) {

    console.error(
      "Fantasy Players error:",
      error
    );

    container.innerHTML =
      "<p>Failed to load Fantasy Players.</p>";

  }

}


// =====================================================
// PLAYER SELECTION
// =====================================================

document.addEventListener(
  "change",
  (e) => {

    if (
      !e.target.classList.contains(
        "fantasyPlayerCheckbox"
      )
    ) {
      return;
    }

    const playerId =
      e.target.dataset.id;

    const player =
      fantasyPlayers.find(
        p => p.id === playerId
      );

    if (!player) return;


    // -----------------------------------------
    // CHECK MAXIMUM 3 PLAYERS
    // -----------------------------------------

    if (
      e.target.checked &&
      selectedFantasyPlayers.length >= 3
    ) {

      e.target.checked = false;

      alert(
        "You can only select 3 players."
      );

      return;

    }


    // -----------------------------------------
    // ADD PLAYER
    // -----------------------------------------

    if (e.target.checked) {

      selectedFantasyPlayers.push(player);

    }

    // -----------------------------------------
    // REMOVE PLAYER
    // -----------------------------------------

    else {

      selectedFantasyPlayers =
        selectedFantasyPlayers.filter(
          p => p.id !== playerId
        );

    }

    updateFantasyTeamDisplay();

  }
);


// =====================================================
// UPDATE TEAM DISPLAY
// =====================================================

function updateFantasyTeamDisplay() {

  const selectedDiv =
    document.getElementById(
      "selectedFantasyPlayers"
    );

  const remainingDiv =
    document.getElementById(
      "fantasyRemainingBudget"
    );

  if (!selectedDiv || !remainingDiv)
    return;


  const totalCost =
    selectedFantasyPlayers.reduce(
      (total, player) =>
        total + Number(player.price),
      0
    );


  const remaining =
    Number(activeFantasyEvent.budget) -
    totalCost;


  remainingDiv.textContent =
    remaining;


  // -----------------------------------------
  // Budget exceeded
  // -----------------------------------------

  if (remaining < 0) {

    remainingDiv.style.color =
      "red";

  }

  else {

    remainingDiv.style.color =
      "";

  }


  // -----------------------------------------
  // No players
  // -----------------------------------------

  if (!selectedFantasyPlayers.length) {

    selectedDiv.innerHTML =
      "No players selected.";

    return;

  }


  // -----------------------------------------
  // Display selected players
  // -----------------------------------------

  selectedDiv.innerHTML = "";

  selectedFantasyPlayers.forEach(
    (player, index) => {

      selectedDiv.innerHTML += `

        <p>

          ${index + 1}.
          <strong>
            ${player.name}
          </strong>

          — 💰 ${player.price}

        </p>

      `;

    }
  );

}


// =====================================================
// SUBMIT FANTASY TEAM
// =====================================================

const submitFantasyTeamBtn =
  document.getElementById(
    "submitFantasyTeamBtn"
  );

if (submitFantasyTeamBtn) {

  submitFantasyTeamBtn.addEventListener(
    "click",
    async () => {

      const user =
        auth.currentUser;

      if (!user) {

        alert(
          "Please login first."
        );

        return;

      }

      if (!activeFantasyEvent) {

        alert(
          "No active Fantasy Event."
        );

        return;

      }


      // -----------------------------------------
      // EXACTLY 3 PLAYERS
      // -----------------------------------------

      if (
        selectedFantasyPlayers.length !== 3
      ) {

        alert(
          "You must select exactly 3 players."
        );

        return;

      }


      // -----------------------------------------
      // CALCULATE COST
      // -----------------------------------------

      const totalCost =
        selectedFantasyPlayers.reduce(
          (total, player) =>
            total + Number(player.price),
          0
        );


      if (
        totalCost >
        Number(activeFantasyEvent.budget)
      ) {

        alert(
          "Your selected players exceed the Fantasy budget."
        );

        return;

      }


      try {

        // -----------------------------------------
        // TEAM DOCUMENT
        // -----------------------------------------

        const teamId =
          `${activeFantasyEvent.id}_${user.uid}`;


        // -----------------------------------------
        // CHECK EXISTING TEAM
        // -----------------------------------------

        const existingTeam =
          await getDoc(

            doc(
              db,
              "fantasyTeams",
              teamId
            )

          );


        if (existingTeam.exists()) {

          alert(
            "You have already submitted your Fantasy Team for this event."
          );

          return;

        }


        // -----------------------------------------
        // SAVE TEAM
        // -----------------------------------------

        await setDoc(

          doc(
            db,
            "fantasyTeams",
            teamId
          ),

          {

            eventId:
              activeFantasyEvent.id,

            userId:
              user.uid,

            playerIds:
              selectedFantasyPlayers.map(
                player => player.id
              ),

            playerNames:
              selectedFantasyPlayers.map(
                player => player.name
              ),

            totalCost,

            fantasyPoints: 0,

            createdAt:
              serverTimestamp()

          }

        );


        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

        alert(
          "🏆 Fantasy Team submitted successfully!"
        );

        document.getElementById(
          "fantasyTeamStatus"
        ).textContent =
          "✅ Your Fantasy Team has been saved.";


        // Disable all selections

        document
          .querySelectorAll(
            ".fantasyPlayerCheckbox"
          )
          .forEach(
            checkbox => {

              checkbox.disabled = true;

            }
          );

        submitFantasyTeamBtn.disabled =
          true;


      }

      catch (error) {

        console.error(
          "Fantasy Team error:",
          error
        );

        alert(
          "❌ Failed to submit Fantasy Team."
        );

      }

    }
  );

}


// =====================================================
// LOAD USER'S EXISTING FANTASY TEAM
// =====================================================

// =====================================================
// LOAD USER'S EXISTING FANTASY TEAM
// =====================================================

async function loadMyFantasyTeam() {

  const user =
    auth.currentUser;

  const pointsDiv =
    document.getElementById(
      "myFantasyPoints"
    );

  if (pointsDiv) {
    pointsDiv.textContent = "0 FP";
  }

  if (!user || !activeFantasyEvent)
    return;

  try {

    const teamRef =
      doc(
        db,
        "fantasyTeams",
        `${activeFantasyEvent.id}_${user.uid}`
      );

    const teamSnap =
      await getDoc(teamRef);

    // -----------------------------------------
    // NO TEAM YET
    // -----------------------------------------

    if (!teamSnap.exists()) {

      if (pointsDiv) {
        pointsDiv.textContent = "0 FP";
      }

      return;

    }

    const team =
      teamSnap.data();


    // -----------------------------------------
    // SHOW FANTASY POINTS
    // -----------------------------------------

    if (pointsDiv) {

      pointsDiv.textContent =
        `${team.fantasyPoints || 0} FP`;

    }


    // -----------------------------------------
    // RESTORE SELECTED PLAYERS
    // -----------------------------------------

    selectedFantasyPlayers = [];

    team.playerIds.forEach(
      playerId => {

        const player =
          fantasyPlayers.find(
            p => p.id === playerId
          );

        if (player) {

          selectedFantasyPlayers.push(
            player
          );

        }

      }
    );


    // -----------------------------------------
    // CHECK SELECTED PLAYERS
    // -----------------------------------------

    document
      .querySelectorAll(
        ".fantasyPlayerCheckbox"
      )
      .forEach(
        checkbox => {

          if (
            team.playerIds.includes(
              checkbox.dataset.id
            )
          ) {

            checkbox.checked = true;

          }

          checkbox.disabled = true;

        }
      );


    // -----------------------------------------
    // UPDATE TEAM DISPLAY
    // -----------------------------------------

    updateFantasyTeamDisplay();


    // -----------------------------------------
    // DISABLE SUBMIT BUTTON
    // -----------------------------------------

    const submitBtn =
      document.getElementById(
        "submitFantasyTeamBtn"
      );

    if (submitBtn) {

      submitBtn.disabled =
        true;

    }


    // -----------------------------------------
    // STATUS
    // -----------------------------------------

    const status =
      document.getElementById(
        "fantasyTeamStatus"
      );

    if (status) {

      status.textContent =
        "🔒 Your Fantasy Team is already locked for this event.";

    }

  }

  catch (error) {

    console.error(
      "Load Fantasy Team error:",
      error
    );

    if (pointsDiv) {

      pointsDiv.textContent =
        "0 FP";

    }

  }

}
// =====================================================
// START FANTASY SYSTEM
// =====================================================

loadFantasyEvent();
