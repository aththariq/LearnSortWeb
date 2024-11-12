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

document
  .getElementById("logout-btn")
  .addEventListener("click", async function () {
    try {
      const response = await fetch("/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.msg || "Logout berhasil");
        window.location.href = "/login.html";
      } else {
        alert(data.msg || "Logout gagal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat logout");
    }
  });
