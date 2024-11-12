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
    if (password !== password2) {
      alert("Password tidak cocok");
      return;
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
});
