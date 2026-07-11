import { db, auth } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp,
getDocs,
deleteDoc,
doc,
query,
where,
Timestamp,
updateDoc,
increment
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const publishBtn = document.getElementById("publishUpdateBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", async () => {

    const title = document.getElementById("updateTitle").value.trim();
    const content = document.getElementById("updateContent").value.trim();
    const imageName = document.getElementById("updateImage").value.trim();

    if (!title || !content) {
      alert("Please fill in the title and update message.");
      return;
    }

    // GitHub image path
    const baseImageUrl =
      "https://babsdavofficial.github.io/ChessClubNews/images/";

    const imageUrl = imageName
      ? baseImageUrl + imageName
      : "";

    try {
      await addDoc(collection(db, "updates"), {
        title: title,
        content: content,
        imageUrl: imageUrl,
        author: auth.currentUser ? auth.currentUser.uid : "admin",
        likes: 0,
        createdAt: serverTimestamp()
      });

      alert("✅ Update published successfully!");

      // Clear form
      document.getElementById("updateTitle").value = "";
      document.getElementById("updateContent").value = "";
      document.getElementById("updateImage").value = "";

    } catch (error) {
      console.error(error);
      alert("❌ Failed to publish update.");
    }

  });
}
// =========================
// CREATE EVENT
// =========================

const createEventBtn =
  document.getElementById("createEventBtn");

if (createEventBtn) {

  createEventBtn.addEventListener(
    "click",
    async () => {

      const title =
        document
        .getElementById("eventTitle")
        .value
        .trim();

      const description =
        document
        .getElementById("eventDescription")
        .value
        .trim();

      if (!title || !description) {

        alert(
          "Please enter title and description."
        );

        return;
      }

      try {

        await addDoc(
          collection(db, "events"),
          {
            title,
            description,
            active: true,
            createdAt: serverTimestamp()
          }
        );

        alert(
          "✅ Event created successfully!"
        );

        document.getElementById(
          "eventTitle"
        ).value = "";

        document.getElementById(
          "eventDescription"
        ).value = "";

      } catch (error) {

        console.error(error);

        alert(
          "Failed to create event."
        );

      }

    }
  );

}

// =========================
// VIEW REGISTRATIONS
// =========================

const loadRegistrationsBtn =
  document.getElementById(
    "loadRegistrationsBtn"
  );

if (loadRegistrationsBtn) {

  loadRegistrationsBtn.addEventListener(
    "click",
    async () => {

      const container =
        document.getElementById(
          "registrationsContainer"
        );

      container.innerHTML =
        "Loading registrations...";

      const snapshot =
        await getDocs(
          collection(
            db,
            "registrations"
          )
        );

      if (snapshot.empty) {

        container.innerHTML =
          "<p>No registrations yet.</p>";

        return;
      }

      container.innerHTML = "";

      snapshot.forEach((docSnap) => {

        const reg =
          docSnap.data();

        container.innerHTML += `

          <div class="card">

            <strong>
              ${reg.name}
            </strong>

            <br>

            ${reg.email}

            <br>

            ${reg.phone}

            <br><br>

            <button
              class="btn secondary deleteRegistrationBtn"
              data-id="${docSnap.id}">

              🗑 Delete

            </button>

          </div>

          <br>

        `;

      });

    }
  );

}

// =========================
// DELETE REGISTRATION
// =========================

document.addEventListener(
  "click",
  async (e) => {

    if (
      !e.target.classList.contains(
        "deleteRegistrationBtn"
      )
    ) return;

    const id =
      e.target.dataset.id;

    if (
      !confirm(
        "Delete registration?"
      )
    ) return;

    try {

     await deleteDoc(
  doc(db, "registrations", id)
);

const card =
  e.target.closest(".card");

if (card) {
  card.remove();
}

      e.target
        .closest(".card")
        .remove();

      alert(
        "✅ Registration deleted."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Delete failed."
      );

    }

  }
);
// =========================
// CREATE PREDICTION
// =========================

const createPredictionBtn =
document.getElementById("createPredictionBtn");

if(createPredictionBtn){

createPredictionBtn.addEventListener("click",async()=>{

const title=
document.getElementById("predictionTitle").value.trim();

const option1=
document.getElementById("predictionOption1").value.trim();

const option2=
document.getElementById("predictionOption2").value.trim();

const option3=
document.getElementById("predictionOption3").value.trim();

const closeDate=
document.getElementById("predictionCloseDate").value;

if(!title||!option1||!option2||!closeDate){

alert("Fill all required fields.");

return;

}

const options=[option1,option2];

if(option3){

options.push(option3);

}

try{

await addDoc(collection(db,"predictions"),{

title,

options,

closesAt: Timestamp.fromDate(new Date(closeDate)),

createdAt:serverTimestamp(),

active:true,

correctAnswer:""

});

alert("✅ Prediction created.");

document.getElementById("predictionTitle").value="";
document.getElementById("predictionOption1").value="";
document.getElementById("predictionOption2").value="";
document.getElementById("predictionOption3").value="";
document.getElementById("predictionCloseDate").value="";

}catch(error){

console.error(error);

alert("Failed.");

}

});

}
const predictionsAdminContainer =
document.getElementById("predictionsAdminContainer");

async function loadPredictionsAdmin(){

if(!predictionsAdminContainer) return;

const snapshot=await getDocs(
collection(db,"predictions")
);

predictionsAdminContainer.innerHTML="";

snapshot.forEach(docSnap=>{

const prediction=docSnap.data();

predictionsAdminContainer.innerHTML+=`

<div class="fact-item">

<strong>

${prediction.title}

</strong>

<br><br>

<button
class="btn secondary viewVotesBtn"
data-id="${docSnap.id}">
👁 View Votes
</button>

<button
class="btn primary declareWinnerBtn"
data-id="${docSnap.id}">
🏆 Declare Winner
</button>

<button
class="btn secondary deletePredictionBtn"
data-id="${docSnap.id}">
🗑 Delete Prediction
</button>

</div>

<br>

`;

});

}

loadPredictionsAdmin();

document.addEventListener(

"click",

async(e)=>{

if(!e.target.classList.contains("viewVotesBtn"))

return;

const predictionId=e.target.dataset.id;

const snapshot=await getDocs(

query(

collection(db,"predictionVotes"),

where("predictionId","==",predictionId)

)

);

let result="";

snapshot.forEach(vote=>{

const data=vote.data();

result+=`

${data.userId}

➡️

${data.choice}

\n

`;

});

alert(result||"No votes yet.");

});


document.addEventListener("click", async (e) => {

if(!e.target.classList.contains("declareWinnerBtn"))
return;

const predictionId=e.target.dataset.id;

const answer=prompt(
"Enter the winning option exactly."
);

if(!answer) return;

// Save winner
await updateDoc(
doc(db,"predictions",predictionId),
{
correctOption:answer,
active:false
}
);

// Find everyone that voted
const votes=await getDocs(

query(
collection(db,"predictionVotes"),
where("predictionId","==",predictionId)
)

);

let winners=0;

for(const vote of votes.docs){

const data=vote.data();

if(
data.choice.toLowerCase()===
answer.toLowerCase()
){

await updateDoc(

doc(db,"users",data.userId),

{

predictionScore:increment(1),

fantasyPoints:increment(5)

}

);

winners++;

}

}

alert(`✅ Winner declared.

${winners} player(s) rewarded.`);

loadPredictionsAdmin();

});

// =========================
// DELETE PREDICTION
// =========================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("deletePredictionBtn"))
        return;

    if (!confirm("Delete this prediction and all votes?"))
        return;

    const predictionId = e.target.dataset.id;

    try {

        // Delete all votes first
        const votesSnapshot = await getDocs(
            query(
                collection(db, "predictionVotes"),
                where("predictionId", "==", predictionId)
            )
        );

        for (const vote of votesSnapshot.docs) {
            await deleteDoc(vote.ref);
        }

        // Delete prediction
        await deleteDoc(
            doc(db, "predictions", predictionId)
        );

        alert("✅ Prediction deleted.");

        loadPredictionsAdmin();

    } catch (error) {

        console.error(error);

        alert("Failed to delete prediction.");

    }

});
const createTriviaBtn =
document.getElementById("createTriviaBtn");

if(createTriviaBtn){

createTriviaBtn.addEventListener("click",async()=>{

const question=
document.getElementById("triviaQuestion").value.trim();

const option1=
document.getElementById("triviaOption1").value.trim();

const option2=
document.getElementById("triviaOption2").value.trim();

const option3=
document.getElementById("triviaOption3").value.trim();

const option4=
document.getElementById("triviaOption4").value.trim();

const closeDate=
document.getElementById("triviaCloseDate").value;

if(
!question||
!option1||
!option2||
!option3||
!option4||
!closeDate
){
alert("Fill all fields.");
return;
}

await addDoc(
collection(db,"trivia"),
{
question,
options:[
option1,
option2,
option3,
option4
],
correctAnswer:"",
active:true,
createdAt:serverTimestamp(),
closesAt:Timestamp.fromDate(
new Date(closeDate)
)
}
);

alert("Trivia created.");

document.getElementById("triviaQuestion").value="";
document.getElementById("triviaOption1").value="";
document.getElementById("triviaOption2").value="";
document.getElementById("triviaOption3").value="";
document.getElementById("triviaOption4").value="";
document.getElementById("triviaCloseDate").value="";

});

}
// =========================
// LOAD TRIVIA (ADMIN)
// =========================

const triviaAdminContainer =
document.getElementById("triviaAdminContainer");

async function loadTriviaAdmin(){

if(!triviaAdminContainer) return;

const snapshot=await getDocs(
collection(db,"trivia")
);

triviaAdminContainer.innerHTML="";

snapshot.forEach(docSnap=>{

const trivia=docSnap.data();

triviaAdminContainer.innerHTML+=`

<div class="fact-item">

<strong>${trivia.question}</strong>

<br><br>

<button
class="btn secondary viewTriviaAnswersBtn"
data-id="${docSnap.id}">
👁 View Answers
</button>

<button
class="btn primary declareTriviaWinnerBtn"
data-id="${docSnap.id}">
🏆 Declare Answer
</button>

<button
class="btn secondary deleteTriviaBtn"
data-id="${docSnap.id}">
🗑 Delete Trivia
</button>

</div>

<br>

`;

});

}

loadTriviaAdmin();

document.addEventListener(

"click",

async(e)=>{

if(!e.target.classList.contains("viewTriviaAnswersBtn"))
return;

const triviaId=e.target.dataset.id;

const snapshot=await getDocs(

query(

collection(db,"triviaAnswers"),

where("triviaId","==",triviaId)

)

);

let text="";

snapshot.forEach(answer=>{

const data=answer.data();

text+=`

${data.userId}

➡️

${data.answer}

`;

});

alert(text||"No answers yet.");

});

document.addEventListener(

"click",

async(e)=>{

if(!e.target.classList.contains("declareTriviaWinnerBtn"))
return;

const triviaId=e.target.dataset.id;

const answer=prompt(

"Enter the correct answer exactly."

);

if(!answer) return;

// Save answer

await updateDoc(

doc(db,"trivia",triviaId),

{

correctAnswer:answer,

active:false

}

);

// Find everyone that answered

const answers=await getDocs(

query(

collection(db,"triviaAnswers"),

where("triviaId","==",triviaId)

)

);

let winners=0;

for(const ans of answers.docs){

const data=ans.data();

if(

data.answer.toLowerCase()===

answer.toLowerCase()

){

await updateDoc(

doc(db,"users",data.userId),

{

triviaCorrect:increment(1),

fantasyPoints:increment(5)

}

);

winners++;

}

}

alert(

`✅ ${winners} player(s) rewarded.`

);

loadTriviaAdmin();

});
// =========================
// DELETE TRIVIA
// =========================

document.addEventListener("click", async (e) => {

if(!e.target.classList.contains("deleteTriviaBtn"))
return;

if(!confirm("Delete this trivia and all answers?"))
return;

const triviaId=e.target.dataset.id;

try{

// Delete all answers

const answers=await getDocs(

query(

collection(db,"triviaAnswers"),

where("triviaId","==",triviaId)

)

);

for(const answer of answers.docs){

await deleteDoc(answer.ref);

}

// Delete trivia

await deleteDoc(

doc(db,"trivia",triviaId)

);

alert("✅ Trivia deleted.");

loadTriviaAdmin();

}catch(error){

console.error(error);

alert("Delete failed.");

}


});

  // =========================
// CREATE PUZZLE
// =========================

const createPuzzleBtn =
document.getElementById("createPuzzleBtn");

if(createPuzzleBtn){

createPuzzleBtn.addEventListener("click",async()=>{

const title=
document.getElementById("puzzleTitle").value.trim();

const image=
document.getElementById("puzzleImage").value.trim();

const move=
document.getElementById("correctMove").value.trim();

const reward=
Number(document.getElementById("puzzleReward").value);

const closeDate=
document.getElementById("puzzleCloseDate").value;

if(
!title||
!image||
!move||
!closeDate
){

alert("Fill all fields.");

return;

}

const imageUrl=

"https://babsdavofficial.github.io/ChessClubNews/images/"+image;

await addDoc(

collection(db,"puzzles"),

{

title,

imageUrl,

correctMove:move,

reward,

active:true,

closesAt:Timestamp.fromDate(

new Date(closeDate)

),

createdAt:serverTimestamp()

}

);

alert("✅ Puzzle Created.");

document.getElementById("puzzleTitle").value="";
document.getElementById("puzzleImage").value="";
document.getElementById("correctMove").value="";
document.getElementById("puzzleReward").value=2;
document.getElementById("puzzleCloseDate").value="";

});

}



// =========================
// LOAD PUZZLES (ADMIN)
// =========================

const puzzleAdminContainer =
document.getElementById("puzzleAdminContainer");

async function loadPuzzleAdmin(){

if(!puzzleAdminContainer) return;

const snapshot=await getDocs(
collection(db,"puzzles")
);

puzzleAdminContainer.innerHTML="";

snapshot.forEach(docSnap=>{

const puzzle=docSnap.data();

puzzleAdminContainer.innerHTML+=`

<div class="fact-item">

<strong>${puzzle.title}</strong>

<br>

Reward:
${puzzle.reward} FP

<br><br>

<button
class="btn secondary viewPuzzleAnswersBtn"
data-id="${docSnap.id}">
👁 View Answers
</button>

<button
class="btn primary declarePuzzleWinnerBtn"
data-id="${docSnap.id}">
🏆 Declare Winner
</button>

<button
class="btn secondary deletePuzzleBtn"
data-id="${docSnap.id}">
🗑 Delete
</button>

</div>

<br>

`;

});

}

loadPuzzleAdmin();


// =========================
// VIEW PUZZLE ANSWERS
// =========================

document.addEventListener("click",async(e)=>{

if(!e.target.classList.contains("viewPuzzleAnswersBtn"))
return;

const puzzleId=e.target.dataset.id;

const snapshot=await getDocs(

query(

collection(db,"puzzleAnswers"),

where("puzzleId","==",puzzleId)

)

);

let text="";

snapshot.forEach(answer=>{

const data=answer.data();

text+=`

${data.userId}

➡️

${data.answer}

`;

});

alert(text||"No answers yet.");

});


// =========================
// DECLARE PUZZLE WINNER
// =========================

document.addEventListener("click",async(e)=>{

if(!e.target.classList.contains("declarePuzzleWinnerBtn"))
return;

const puzzleId=e.target.dataset.id;

const move=prompt("Enter the correct move exactly.");

if(!move) return;

await updateDoc(

doc(db,"puzzles",puzzleId),

{

correctMove:move,

active:false

}

);

const answers=await getDocs(

query(

collection(db,"puzzleAnswers"),

where("puzzleId","==",puzzleId)

)

);

let winners=0;

for(const ans of answers.docs){

const data=ans.data();

if(

data.answer.trim().toLowerCase()===

move.trim().toLowerCase()

){

await updateDoc(

doc(db,"users",data.userId),

{

fantasyPoints:increment(2)

}

);

winners++;

}

}

alert(`✅ ${winners} player(s) rewarded.`);

loadPuzzleAdmin();

});


// =========================
// DELETE PUZZLE
// =========================

document.addEventListener("click",async(e)=>{

if(!e.target.classList.contains("deletePuzzleBtn"))
return;

if(!confirm("Delete this puzzle and all submissions?"))
return;

const puzzleId=e.target.dataset.id;

const answers=await getDocs(

query(

collection(db,"puzzleAnswers"),

where("puzzleId","==",puzzleId)

)

);

for(const ans of answers.docs){

await deleteDoc(ans.ref);

}

await deleteDoc(

doc(db,"puzzles",puzzleId)

);

alert("Puzzle deleted.");

loadPuzzleAdmin();

});
