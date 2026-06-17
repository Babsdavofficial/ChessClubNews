// Temporary Admin Update Handler

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

    // GitHub image folder
    const baseImageUrl =
      "https://babsdavofficial.github.io/ChessClubNews/images/";

    // Build full image URL automatically
    const imageUrl = imageName
      ? baseImageUrl + imageName
      : "";

    console.log("=== NEW UPDATE ===");
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Image URL:", imageUrl);

    alert(
      "✅ Admin form is working!\n\n" +
      "Title: " + title +
      "\nImage URL: " + (imageUrl || "No image") +
      "\n\nNext step: Save to Firestore."
    );

  });
}
