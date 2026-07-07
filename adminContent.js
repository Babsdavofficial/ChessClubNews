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

View Votes

</button>

<button
class="btn primary declareWinnerBtn"
data-id="${docSnap.id}">

Declare Winner

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
