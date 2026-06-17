// Temporary Admin Update Handler
// Firestore connection will come in the next step.

const publishBtn = document.getElementById("publishUpdateBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", () => {
   const title = document.getElementById("updateTitle").value.trim();
   const content = document.getElementById("updateContent").value.trim();
   const imageName = document.getElementById("updateImage").value.trim();

    if (!title || !content) {
      alert("Please enter both a title and an update message.");
      return;
    }

    console.log("=== NEW UPDATE ===");
    console.log("Title:", title);
    console.log("Content:", content);

    if (imageName) {
  console.log("Image filename:", imageName);
} else {
  console.log("No image provided.");
}

alert(
  "✅ Admin form is working!\n\n" +
  "Title: " + title +
  "\nImage: " + (imageName || "None") +
  "\n\nNext step: Save to Firebase."
);
  });
}
