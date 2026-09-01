// Utility Selectors
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
  // Tab Switching Handler
  const tabs = $$(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Deactivate all active tabs and panes
      $$(".tab").forEach((item) => item.classList.remove("active"));
      $$(".auth-pane").forEach((pane) => pane.classList.remove("active"));

      // Activate selected tab and matching pane
      tab.classList.add("active");
      const targetPane = $(`#${tab.dataset.tab}-pane`);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });

  // Login Form Submission
  const loginForm = $("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msgElement = $("#login-msg");
      if (msgElement) msgElement.textContent = "";

      try {
        const formData = Object.fromEntries(new FormData(e.target));
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Login failed. Please check your credentials.");
        }

        window.location.href = "/dashboard";
      } catch (err) {
        if (msgElement) {
          msgElement.textContent = err.message;
        }
      }
    });
  }

  // Registration Form Submission
  const registerForm = $("#register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msgElement = $("#register-msg");
      if (msgElement) msgElement.textContent = "";

      try {
        const formData = Object.fromEntries(new FormData(e.target));
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Registration failed. Please try again.");
        }

        window.location.href = "/dashboard";
      } catch (err) {
        if (msgElement) {
          msgElement.textContent = err.message;
        }
      }
    });
  }
});