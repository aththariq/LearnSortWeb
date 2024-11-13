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
        // Replace alert with SweetAlert2
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Anda belum login.',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.href = "/login.html";
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching status:", error);
      // Replace alert with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat memeriksa status login.',
        confirmButtonText: 'OK'
      });
    });

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Confirm logout with SweetAlert2
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/logout", {
            method: "GET",
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              // Replace alert with SweetAlert2
              Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: data.msg || "Logout berhasil.",
                confirmButtonText: 'OK'
              }).then(() => {
                window.location.href = "/login.html";
              });
            })
            .catch((error) => {
              console.error("Error during logout:", error);
              // Replace alert with SweetAlert2
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Terjadi kesalahan saat logout.",
                confirmButtonText: 'OK'
              });
            });
        }
      });
    });
  }

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
});

