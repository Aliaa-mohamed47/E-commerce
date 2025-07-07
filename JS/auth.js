// File: auth.js - Login/Register logic by Aliaa
const form = document.getElementById("registerForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("user", JSON.stringify(user));

  // Redirect after successful registration
  window.location.href = "login.html";
});
