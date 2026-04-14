const header = document.getElementById("header");
const footer = document.getElementById("footer");

// Header load
if (header) {
  fetch("/components/header.html")
    .then((res) => res.text())
    .then((data) => {
      header.innerHTML = data;

      // Dark mode toggle
      const toggle = document.getElementById("darkToggle");
      const icon = document.getElementById("themeIcon");

      // Load saved theme
      if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        icon.classList.replace("fa-moon", "fa-sun");
      }

      toggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");

        // Icon change
        if (isDark) {
          icon.classList.replace("fa-moon", "fa-sun");
        } else {
          icon.classList.replace("fa-sun", "fa-moon");
        }

        localStorage.setItem("darkMode", isDark);
      });
    });
}

// Footer load
if (footer) {
  fetch("/components/footer.html")
    .then((res) => res.text())
    .then((data) => {
      footer.innerHTML = data;
    });
}
