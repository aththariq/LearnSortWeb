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
        const { username, xp, recentActivities } = data.user;
        document.getElementById("username-display").textContent = username;
        initializeProgressChart(xp);
        updateRecentActivities(recentActivities);
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

  // Initialize Doughnut Chart based on user XP
  function initializeProgressChart(xp) {
    const ctx = document.getElementById("progress-chart").getContext("2d");
    const progressPercentage = Math.min(xp, 100); // Cap at 100
    const remaining = 100 - progressPercentage;

    const progressChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            data: [progressPercentage, remaining],
            backgroundColor: ["#2d6a4f", "#d3d3d3"],
            hoverBackgroundColor: ["#1b4332", "#bbbbbb"],
          },
        ],
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Update progress text
    document.querySelector(".progress-text h2").textContent = `${progressPercentage}%`;
  }

  // Update Recent Activities Section
  function updateRecentActivities(activities) {
    const recentActivityDiv = document.querySelector(".recent-activity");
    recentActivityDiv.innerHTML = ""; // Clear existing activities

    if (activities.length === 0) {
      recentActivityDiv.innerHTML = "<p>Belum ada aktivitas terbaru.</p>";
      return;
    }

    activities.forEach((activity) => {
      const activityP = document.createElement("p");
      activityP.textContent = `${activity.activity} +${activity.xpGained}xp`;
      recentActivityDiv.appendChild(activityP);
    });
  }

  // Inisialisasi Donut Chart untuk Progress Tracker
  // Removed duplicate initialization
});

