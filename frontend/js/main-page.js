document.addEventListener("DOMContentLoaded", function () {
  // Fetch user status
  fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/status", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User data:", data);
      if (data.authenticated) {
        document.getElementById("username-display").textContent =
          data.user.username;
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
  if (logoutBtn) {
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
  }
});

// Ensure that this file does not contain conflicting code for the main page.

// If dashboard.js is not needed on main-page.html, you can remove its reference from the HTML.

// Inisialisasi Donut Chart untuk Progress Tracker
const ctx = document.getElementById("progress-chart").getContext("2d");
const progressChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [60, 40], // 60% progress, 40% remaining
        backgroundColor: ["#2d6a4f", "#d3d3d3"], // Warna donut chart
        hoverBackgroundColor: ["#1b4332", "#bbbbbb"],
      },
    ],
  },
  options: {
    cutout: "70%", // Untuk membuat donut chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Sembunyikan legend
      },
    },
  },
});

