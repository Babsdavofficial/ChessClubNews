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
  Timestamp
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
let selectedPrediction = null;

async function loadPrediction(){

const snapshot = await getDocs(

query(

collection(db,"predictions"),

where("active","==",true),

orderBy("createdAt","desc"),

limit(1)

)

);

if(snapshot.empty){

document.getElementById("predictionTitle").textContent=
"No prediction available.";

return;

}

const predictionDoc=snapshot.docs[0];

selectedPrediction={
id:predictionDoc.id,
...predictionDoc.data()
};

document.getElementById("predictionTitle").textContent=
selectedPrediction.title;

const optionsDiv=
document.getElementById("predictionOptions");

optionsDiv.innerHTML="";

selectedPrediction.options.forEach(option=>{

optionsDiv.innerHTML+=`

<label>

<input
type="radio"
name="predictionOption"
value="${option}">

${option}

</label>

<br><br>

`;

});

}

loadPrediction();

document
.getElementById("submitPredictionBtn")
.addEventListener("click",async()=>{

const user=auth.currentUser;

if(!user){

alert("Login first.");

return;

}

if(!selectedPrediction){

return;

}

const choice=document.querySelector(
'input[name="predictionOption"]:checked'
);

if(!choice){

alert("Select an option.");

return;

}

const alreadyVoted=await getDocs(

query(

collection(db,"predictionVotes"),

where("predictionId","==",selectedPrediction.id),

where("userId","==",user.uid)

)

);

if(!alreadyVoted.empty){

alert("You have already voted.");

return;

}

await addDoc(

collection(db,"predictionVotes"),

{

predictionId:selectedPrediction.id,

userId:user.uid,

choice:choice.value,

createdAt:serverTimestamp()

}

);

document.getElementById("predictionStatus")
.textContent="✅ Prediction submitted.";

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
