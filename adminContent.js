// Temporary Admin Update Handler
// Firestore connection will come in the next step.

const publishBtn = document.getElementById("publishUpdateBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", () => {
    const title = document.getElementById("updateTitle").value.trim();
    const content = document.getElementById("updateContent").value.trim();
    const image = document.getElementById("updateImage").files[0];

    if (!title || !content) {
      alert("Please enter both a title and an update message.");
      return;
    }

    console.log("=== NEW UPDATE ===");
    console.log("Title:", title);
    console.log("Content:", content);

    if (image) {
      console.log("Image selected:", image.name);
    } else {
      console.log("No image selected.");
    }

    alert(
      "✅ Admin form is working!\n\n" +
      "Title: " + title +
      "\n\nNext step: Save to Firebase."
    );
  });
}
