document.addEventListener("DOMContentLoaded", function () {


  const lessonLinks = document.querySelectorAll(".lessons-grid .menu");

  
  const resourceLinks = document.querySelectorAll(".resource-card a");

  lessonLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); 

      let activityName = this.querySelector(".lesson-card")?.textContent.trim() || "Learn Activity";
      let xpGained = 12.5; 

      logUserActivity(activityName, xpGained).then(() => {
        window.location.href = this.href;
      });
    });
  });

  resourceLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); 

      let activityName = this.querySelector(".resource-title")?.textContent.trim() || "Resource";
      let xpGained = 12.5; 

      logUserActivity(activityName, xpGained).then(() => {
        window.open(this.href, '_blank');
      });
    });
  });

  async function logUserActivity(activity, xp) {
    try {
      const response = await fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/log-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ activity, xpGained: xp })
      });

      const data = await response.json();
      console.log("Activity logged:", data);
      updateProgressAndActivities(data.xp, data.recentActivities.slice(0, 4)); 
    } catch (error) {
      console.error("Error logging activity:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Terjadi kesalahan saat mencatat aktivitas.",
        confirmButtonText: 'OK'
      });
    }
  }

  function updateProgressAndActivities(xp, activities) {
    const ctx = document.getElementById("progress-chart").getContext("2d");
    const progressPercentage = Math.min(xp, 100); 
    const remaining = 100 - progressPercentage;

    if (window.progressChartInstance) {
      window.progressChartInstance.data.datasets[0].data = [progressPercentage, remaining];
      window.progressChartInstance.update();
    } else {
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
    }

    document.querySelector(".progress-text h2").textContent = `${progressPercentage}%`;

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