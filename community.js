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

<div class="card">

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
