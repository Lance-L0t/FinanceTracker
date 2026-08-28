function switchTab(tabName) {
  // Remove 'active' class from all forms and tab buttons
  document
    .querySelectorAll(".form-content")
    .forEach((form) => form.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // Add 'active' class to selected form and tab button
  document.getElementById(`form-${tabName}`).classList.add("active");
  event.currentTarget.classList.add("active");
}
