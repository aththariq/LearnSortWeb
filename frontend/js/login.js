// public/js/login.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login, redirect to main page
        window.location.href = "/main-page.html";
      } else {
        // Display error message
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  });

  // Google Sign-In Button
  const googleSignInBtn = document.querySelector(".google-sign-in");
  googleSignInBtn.addEventListener("click", function () {
    window.location.href =
      "https://learnsort-00d5721850fc.herokuapp.com/auth/google";
  });
});
