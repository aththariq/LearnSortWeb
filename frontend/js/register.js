// public/js/register.js

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah form dikirim secara default

    // Ambil nilai dari input
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    // Validasi sederhana di frontend
    const passwordWarning = document.getElementById("password-warning");
    if (password !== password2) {
      passwordWarning.textContent = "Passwords do not match";
      document.getElementById("password2").classList.add("invalid");
      document.getElementById("password2").reportValidity();
      return;
    } else {
      passwordWarning.textContent = "";
      document.getElementById("password2").classList.remove("invalid");
      document.getElementById("password2").setCustomValidity("");
    }

    // Check email validity
    const emailInput = document.getElementById("email");
    if (!emailInput.checkValidity()) {
      emailInput.classList.add("invalid");
      emailInput.reportValidity();
      return;
    } else {
      emailInput.classList.remove("invalid");
    }

    const backendUrl = "https://learnsort-00d5721850fc.herokuapp.com"; // Add this line

    try {
      const response = await fetch(`${backendUrl}/auth/register`, { // Changed from "/auth/register" to `${backendUrl}/auth/register`
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, password2 }),
        credentials: "include", // Sertakan cookies jika diperlukan
      });

      const data = await response.json();

      if (response.ok) {
        // Registrasi berhasil, arahkan ke login
        alert("Registrasi berhasil! Silakan login.");
        window.location.href = "/login.html";
      } else {
        // Tampilkan pesan kesalahan
        const errors = data.errors;
        if (errors && errors.length > 0) {
          alert(errors.map((err) => err.msg).join("\n"));
        } else {
          alert(data.msg || "Registrasi gagal");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat registrasi");
    }
  });

  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling;
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector(".fa").classList.toggle("fa-eye-slash");
    });
  });

  // Add event listeners to validate inputs on change
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("input", function () {
      if (this.checkValidity()) {
        this.classList.remove("invalid");
      } else {
        this.classList.add("invalid");
      }
    });
  });

  // Add event listeners to validate inputs on blur
  inputs.forEach(input => {
    input.addEventListener("blur", function () {
      if (this.checkValidity()) {
        this.classList.remove("invalid");
      } else {
        this.classList.add("invalid");
      }
    });
  });
});
