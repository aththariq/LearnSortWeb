// public/js/login.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah form dikirim secara default

    // Ambil nilai dari input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Sertakan cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil, arahkan ke dashboard
        window.location.href = "/dashboard.html";
      } else {
        // Tampilkan pesan kesalahan
        alert(data.msg || "Login gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat login");
    }
  });

  // Google Sign-In Button
  const googleSignInBtn = document.querySelector(".google-sign-in");
  googleSignInBtn.addEventListener("click", function () {
    window.location.href = "/auth/google";
  });
});
