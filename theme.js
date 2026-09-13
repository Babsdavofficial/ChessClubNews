/* =========================================================
CHESS NEWS HUB
THEME CONTROLLER
----------------

Handles Light / Dark mode and remembers the user's choice.
========================================================= */

/* =========================================================
APPLY SAVED THEME IMMEDIATELY
========================================================= */

const savedTheme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute(
"data-theme",
savedTheme
);

/* =========================================================
THEME SELECT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


const themeSelect = document.getElementById("themeSelect");

if (!themeSelect) return;


/* Set selector to current theme */

themeSelect.value = savedTheme;


/* Change theme */

themeSelect.addEventListener("change", () => {

    const selectedTheme = themeSelect.value;


    document.documentElement.setAttribute(
        "data-theme",
        selectedTheme
    );


    /* Remember choice */

    localStorage.setItem(
        "theme",
        selectedTheme
    );


    /* Update icon */

    const icon =
        document.querySelector(".theme-setting-icon");

    if (icon) {

        icon.textContent =
            selectedTheme === "dark"
                ? "🌙"
                : "☀️";
    }

});


/* Set initial icon */

const icon =
    document.querySelector(".theme-setting-icon");

if (icon) {

    icon.textContent =
        savedTheme === "dark"
            ? "🌙"
            : "☀️";
}


});
