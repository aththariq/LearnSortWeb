const questions = [
  {
    question: "Which sorting algorithm has the best average time complexity?",
    answers: [
      { text: "Quick Sort", correct: false },
      { text: "Merge Sort", correct: true },
      { text: "Bubble Sort", correct: false },
      { text: "Insertion Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm is not stable?",
    answers: [
      { text: "Merge Sort", correct: false },
      { text: "Quick Sort", correct: true },
      { text: "Bubble Sort", correct: false },
      { text: "Insertion Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm is best for nearly sorted data?",
    answers: [
      { text: "Quick Sort", correct: false },
      { text: "Merge Sort", correct: false },
      { text: "Bubble Sort", correct: false },
      { text: "Insertion Sort", correct: true },
    ],
  },
  // Add more sorting algorithm questions as needed
];

let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");
const startContainer = document.getElementById("start-container");
const quizBox = document.getElementById("quiz-box");
const lastScoreDisplay = document.getElementById("last-score");
const lastAttemptDisplay = document.getElementById("last-attempt");
const reattemptButton = document.getElementById("reattempt-button");
const resultContainer = document.getElementById("result-container");

// Add functions to save and load quiz state
function saveQuizState() {
  localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  localStorage.setItem('score', score);
}

function loadQuizState() {
  const savedIndex = localStorage.getItem('currentQuestionIndex');
  const savedScore = localStorage.getItem('score');
  if (savedIndex !== null && savedScore !== null) {
    currentQuestionIndex = parseInt(savedIndex);
    score = parseInt(savedScore);
    scoreDisplay.innerText = `Score: ${score}`;
    if (currentQuestionIndex < questions.length) {
      showQuestion(questions[currentQuestionIndex]);
      quizBox.style.display = "block";
      startContainer.style.display = "none";
    } else {
      showResult();
    }
  } else {
    startContainer.style.display = "block";
    quizBox.style.display = "none";
  }
}

function startQuiz() {
  startContainer.style.display = "none";
  quizBox.style.display = "block";
  resultContainer.style.display = "none"; // Hide result-container
  questionContainer.style.display = "block"; // Show question-container
  answerButtons.style.display = "block"; // Ensure answer buttons are visible
  currentQuestionIndex = 0; // Reset question index
  score = 0; // Reset score
  scoreDisplay.innerText = `Score: ${score}`;
  localStorage.removeItem('currentQuestionIndex'); // Clear saved index
  localStorage.removeItem('score'); // Clear saved score
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionContainer.innerText = question.question;
  answerButtons.innerHTML = ""; // Clear previous answer buttons

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(answer));
    answerButtons.appendChild(button);
  });
}

function selectAnswer(answer) {
  if (answer.correct) {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
  }

  currentQuestionIndex++;
  saveQuizState(); // Save current state

  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    showResult();
  }
}

function showResult() {
  // Hide the question container and answer buttons
  questionContainer.style.display = "none";
  answerButtons.style.display = "none";
  // Show the result container
  resultContainer.style.display = "block";
  saveUserStats();
  localStorage.removeItem('currentQuestionIndex'); // Clear saved index
  localStorage.removeItem('score'); // Clear saved score
}

function saveUserStats() {
  const now = new Date();
  localStorage.setItem("lastScore", score);
  localStorage.setItem("lastAttempt", now.toString());
  saveHistory(score, now);
  displayUserStats();
}

function saveHistory(score, date) {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  history.push({ score, date: date.toString() });
  localStorage.setItem("quizHistory", JSON.stringify(history));
}

function displayUserStats() {
  const lastScore = localStorage.getItem("lastScore");
  const lastAttempt = localStorage.getItem("lastAttempt");

  lastScoreDisplay.innerText = `Last Score: ${lastScore ? lastScore : "N/A"}`;
  lastAttemptDisplay.innerText = `Last Attempt: ${
    lastAttempt ? new Date(lastAttempt).toLocaleString() : "N/A"
  }`;
}

startButton.addEventListener("click", startQuiz);

reattemptButton.addEventListener("click", () => {
  // Reset scores and indices
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  // Hide result-container
  resultContainer.style.display = "none";
  // Show start-container and hide quiz-box
  startContainer.style.display = "block";
  quizBox.style.display = "none";
  localStorage.removeItem('currentQuestionIndex'); // Clear saved index
  localStorage.removeItem('score'); // Clear saved score
});

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Confirm logout with SweetAlert2
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
            // Replace alert with SweetAlert2
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
            // Replace alert with SweetAlert2
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

// Add event listener to load quiz state and display user stats on page load
window.addEventListener('load', () => {
  loadQuizState();
  displayUserStats(); // Ensure user stats are displayed on load
});
