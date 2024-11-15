document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  const emailInput = document.getElementById("email");
  const emailWarning = document.getElementById("email-warning");

  emailInput.addEventListener("input", function () {
    if (!emailInput.checkValidity()) {
      emailWarning.textContent = "Please enter a valid email address.";
      emailInput.classList.add("invalid");
    } else {
      emailWarning.textContent = "";
      emailInput.classList.remove("invalid");
    }
  });

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    const passwordWarning = document.getElementById("password-warning");

    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password harus minimal 6 karakter!",
      });
      document.getElementById("password").classList.add("invalid");
      return;
    }

    if (password !== password2) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match",
      });
      document.getElementById("password2").classList.add("invalid");
      document.getElementById("password2").reportValidity();
      return;
    } else {
      passwordWarning.textContent = "";
      document.getElementById("password2").classList.remove("invalid");
      document.getElementById("password2").setCustomValidity("");
    }

    if (!emailInput.checkValidity()) {
      emailInput.classList.add("invalid");
      emailInput.reportValidity();
      return;
    } else {
      emailInput.classList.remove("invalid");
    }

    const backendUrl = "https://learnsort-00d5721850fc.herokuapp.com";

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, password2 }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registrasi berhasil!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "login.html";
        });
      } else {
        const errors = data.errors;
        if (errors && errors.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Gagal Registrasi",
            text: errors.map((err) => err.msg).join("\n"),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Registrasi",
            text: data.msg || "Registrasi gagal",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Terjadi kesalahan saat registrasi",
      });
    }
  });

  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling;
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.querySelector(".fa").classList.toggle("fa-eye-slash");
    });
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.checkValidity()) {
        this.classList.remove("invalid");
      } else {
        this.classList.add("invalid");
      }
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.checkValidity()) {
        this.classList.remove("invalid");
      } else {
        this.classList.add("invalid");
      }
    });
  });
});
