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
  {
    question: "Which sorting algorithm uses a divide and conquer approach?",
    answers: [
      { text: "Heap Sort", correct: false },
      { text: "Quick Sort", correct: true },
      { text: "Bubble Sort", correct: false },
      { text: "Selection Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm has the worst-case time complexity of O(n²)?",
    answers: [
      { text: "Merge Sort", correct: false },
      { text: "Quick Sort", correct: false },
      { text: "Bubble Sort", correct: true },
      { text: "Heap Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm is in-place and not stable?",
    answers: [
      { text: "Bubble Sort", correct: false },
      { text: "Insertion Sort", correct: false },
      { text: "Heap Sort", correct: true },
      { text: "Merge Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm requires additional memory proportional to n?",
    answers: [
      { text: "Insertion Sort", correct: false },
      { text: "Merge Sort", correct: true },
      { text: "Heap Sort", correct: false },
      { text: "Bubble Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm builds a binary heap from the input data?",
    answers: [
      { text: "Quick Sort", correct: false },
      { text: "Heap Sort", correct: true },
      { text: "Insertion Sort", correct: false },
      { text: "Merge Sort", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm repeatedly swaps adjacent elements if they are in the wrong order?",
    answers: [
      { text: "Merge Sort", correct: false },
      { text: "Selection Sort", correct: false },
      { text: "Bubble Sort", correct: true },
      { text: "Heap Sort", correct: false },
    ],
  },
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
  resultContainer.style.display = "none"; 
  questionContainer.style.display = "block"; 
  answerButtons.style.display = "block"; 
  currentQuestionIndex = 0; 
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  localStorage.removeItem('currentQuestionIndex');
  localStorage.removeItem('score'); 
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionContainer.innerText = question.question;
  answerButtons.innerHTML = "";

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
  saveQuizState(); 

  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    showResult();
  }
}

function showResult() {
  questionContainer.style.display = "none";
  answerButtons.style.display = "none";
  resultContainer.style.display = "block";
  saveUserStats();
  localStorage.removeItem('currentQuestionIndex');
  localStorage.removeItem('score'); 
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
  currentQuestionIndex = 0;
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  resultContainer.style.display = "none";
  startContainer.style.display = "block";
  quizBox.style.display = "none";
  localStorage.removeItem('currentQuestionIndex');
  localStorage.removeItem('score'); 
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

window.addEventListener('load', () => {
  loadQuizState();
  displayUserStats(); 
});
