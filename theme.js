const themeToggleButton = document.getElementById("theme-toggle");

// Check if a theme is saved in localStorage
const currentTheme = localStorage.getItem("theme");

// Apply the saved theme if available
if (currentTheme === "dark") {
    document.body.classList.add("dark");
} else {
    document.body.classList.remove("dark");
}

// Add event listener to toggle the theme
themeToggleButton.addEventListener("click", () => {
    // Toggle dark mode class on body
    document.body.classList.toggle("dark");

    // Save the theme to localStorage
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});
