document.addEventListener("DOMContentLoaded", function () {
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
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Anda belum login.",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/login.html";
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memeriksa status login.",
        confirmButtonText: "OK",
      });
    });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/logout", {
            method: "GET",
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: data.msg || "Logout berhasil.",
                confirmButtonText: "OK",
              }).then(() => {
                window.location.href = "/login.html";
              });
            })
            .catch((error) => {
              console.error("Error during logout:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Terjadi kesalahan saat logout.",
                confirmButtonText: "OK",
              });
            });
        }
      });
    });
  }

  function initializeProgressChart(xp) {
    const ctx = document.getElementById("progress-chart").getContext("2d");
    const progressPercentage = Math.min(xp, 100); // Cap at 100
    const remaining = 100 - progressPercentage;

    window.progressChartInstance = new Chart(ctx, {
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

    document.querySelector(
      ".progress-text h2"
    ).textContent = `${progressPercentage}%`;
  }

  function updateRecentActivities(activities) {
    const recentActivityDiv = document.querySelector(".recent-activity");
    recentActivityDiv.innerHTML = "";

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
});
