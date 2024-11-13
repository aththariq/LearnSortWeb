document.addEventListener("DOMContentLoaded", function () {
  // Example: Log activity when a resource or lesson is accessed
  const lessonButtons = document.querySelectorAll(".lesson-card, .resource-card a");

  lessonButtons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default navigation

      const activityName = this.querySelector(".lesson-card, .resource-title")?.textContent || "Resource Access";
      const xpGained = getXpForActivity(activityName);

      logUserActivity(activityName, xpGained).then(() => {
        // After logging, navigate to the link
        window.location.href = this.href;
      });
    });
  });

  function getXpForActivity(activity) {
    // Define XP values based on activity
    const xpMapping = {
      "Bubble Sort": 20,
      "Quick Sort": 20,
      "Heap Sort": 20,
      "Merge Sort": 20,
      "Learn Bubble Sort": 10,
      "Learn Merge Sort": 15,
      "Learn Insertion Sort": 10,
      // Add more mappings as needed
    };

    return xpMapping[activity] || 5; // Default XP
  }

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
      // Optionally, update the UI immediately
      updateProgressAndActivities(data.xp, data.recentActivities);
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
    // Update the Doughnut Chart
    const ctx = document.getElementById("progress-chart").getContext("2d");
    const progressPercentage = Math.min(xp, 100); // Cap at 100
    const remaining = 100 - progressPercentage;

    // Update existing chart
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

    // Update progress text
    document.querySelector(".progress-text h2").textContent = `${progressPercentage}%`;

    // Update Recent Activities
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
});