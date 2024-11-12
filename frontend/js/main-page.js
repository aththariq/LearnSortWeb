document.addEventListener("DOMContentLoaded", function () {
  // Fetch user status
  fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/status", {
    method: "GET",
    credentials: "include", // Include cookies
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        document.getElementById(
          "welcome-message"
        ).textContent = `Hello, ${data.user.username}!`;
      } else {
        alert("Anda belum login.");
        window.location.href = "/login.html";
      }
    })
    .catch((error) => {
      console.error("Error fetching status:", error);
      alert("Terjadi kesalahan saat memeriksa status login.");
    });

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", function () {
    fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.msg || "Logout berhasil.");
        window.location.href = "/login.html";
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Terjadi kesalahan saat logout.");
      });
  });
});
