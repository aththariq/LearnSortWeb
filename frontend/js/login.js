document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    let valid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailError.textContent = 'Invalid email format';
      emailInput.classList.add('error');
      valid = false;
      console.log("Email format invalid");
    } else {
      emailError.textContent = '';
      emailInput.classList.remove('error');
    }

    if (password.trim() === '') {
      passwordError.textContent = 'Password is required';
      passwordInput.classList.add('error');
      valid = false;
      console.log("Password is required");
    } else {
      passwordError.textContent = '';
      passwordInput.classList.remove('error');
    }

    if (!valid) {
      return;
    }

    const backendUrl = "https://learnsort-00d5721850fc.herokuapp.com"; 

    try {
      const response = await fetch(`${backendUrl}/auth/login`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/main-page.html";
      } else {
        passwordError.textContent = data.msg || "Invalid email or password";
        passwordInput.classList.add('error');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  });

  emailInput.addEventListener('input', function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = 'Invalid email format';
      emailInput.classList.add('error');
    } else {
      emailError.textContent = '';
      emailInput.classList.remove('error');
    }
  });

  passwordInput.addEventListener('input', function () {
    if (passwordInput.value.trim() === '') {
      passwordError.textContent = 'Password is required';
      passwordInput.classList.add('error');
    } else {
      passwordError.textContent = '';
      passwordInput.classList.remove('error');
    }
  });

  const googleSignInBtn = document.querySelector(".google-sign-in");
  googleSignInBtn.addEventListener("click", function () {
    window.location.href =
      "https://learnsort-00d5721850fc.herokuapp.com/auth/google";
  });

  const togglePasswordBtn = document.querySelector(".toggle-password");

  togglePasswordBtn.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.querySelector(".fa").classList.toggle("fa-eye-slash");
  });
});
