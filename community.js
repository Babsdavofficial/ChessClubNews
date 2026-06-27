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
