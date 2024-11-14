document.addEventListener("DOMContentLoaded", () => {
  const historyContainer = document.getElementById("history-container");
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  if (history.length === 0) {
    historyContainer.innerHTML = "<p>No quiz history available.</p>";
  } else {
    history.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    history.forEach((entry) => {
      const historyItem = document.createElement("div");
      historyItem.classList.add("history-item");
      historyItem.innerHTML = `
        <p>Score: ${entry.score}</p>
        <p>Date: ${new Date(entry.date).toLocaleString()}</p>
      `;
      historyContainer.appendChild(historyItem);
    });
  }

  // Fetch user status
  fetch("https://learnsort-00d5721850fc.herokuapp.com/auth/status", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("User data:", data);
      if (data.authenticated) {
        const { username } = data.user;
        document.getElementById("username-display").textContent = username;
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
        text: `Terjadi kesalahan saat memeriksa status login: ${error.message}`,
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
});
