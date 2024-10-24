document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("sortCanvas");
  const ctx = canvas.getContext("2d");

  let array = [];
  let arraySize = 20;
  let sorting = false;
  let speed = 100;
  let selectedAlgorithm = "bubble"; // Default algoritma
  let swapped;
  let isPlaying = false; // Status untuk tombol play/pause

  // Fungsi untuk menggambar array di canvas
  function drawArray(arr) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / arr.length;

    for (let i = 0; i < arr.length; i++) {
      const barHeight = arr[i] * 4;
      ctx.fillStyle = "#8fa3e8";
      ctx.fillRect(
        i * barWidth,
        canvas.height - barHeight,
        barWidth - 2,
        barHeight
      );
      ctx.fillStyle = "#444"; // Warna angka lebih terlihat
      ctx.fillText(
        arr[i],
        i * barWidth + barWidth / 4,
        canvas.height - barHeight - 10
      );
    }
  }

  // Fungsi untuk menginisialisasi array
  function initArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 100) + 1);
    }
    drawArray(array);
  }

  // Fungsi untuk memulai algoritma sesuai pilihan
  async function startSorting() {
    if (!sorting) {
      if (selectedAlgorithm === "bubble") {
        await bubbleSort();
      } else if (selectedAlgorithm === "merge") {
        await mergeSort();
      } else if (selectedAlgorithm === "quick") {
        await quickSort();
      }
    }
  }

  // Bubble Sort Logic
  async function bubbleSort() {
    sorting = true;
    do {
      swapped = false;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
          let temp = array[i];
          array[i] = array[i + 1];
          array[i + 1] = temp;
          swapped = true;
          drawArray(array);
          await new Promise((resolve) => setTimeout(resolve, speed));
        }
      }
    } while (swapped && sorting);
    sorting = false;
  }

  // Merge Sort Logic
  async function mergeSort(arr = array, l = 0, r = array.length - 1) {
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  }

  async function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = [];
    let R = [];

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let i = 0; i < n2; i++) R[i] = arr[m + 1 + i];

    let i = 0,
      j = 0,
      k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }

    while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }

    while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  }

  // Quick Sort Logic
  async function quickSort(arr = array, left = 0, right = array.length - 1) {
    if (left >= right) return;

    let pivot = await partition(arr, left, right);
    await quickSort(arr, left, pivot - 1);
    await quickSort(arr, pivot + 1, right);
  }

  async function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        drawArray(arr);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }

    let temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;
    drawArray(arr);
    await new Promise((resolve) => setTimeout(resolve, speed));

    return i + 1;
  }

  document.querySelectorAll(".dropdown-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      selectedAlgorithm = e.target.getAttribute("data-algorithm");

      // Ubah hanya teks dalam <span> yang berisi teks dropdown, tanpa mengubah ikon chevron
      document.getElementById("dropdown-text").textContent =
        e.target.textContent;

      // Tutup dropdown dan putar kembali chevron
      dropdownContent.classList.remove("active");
      chevron.classList.remove("rotate");
    });
  });

  // Fungsi untuk menunjukkan dropdown
  window.showMenu = function () {
    dropdownContent.classList.toggle("active");
    chevron.classList.toggle("rotate");
  };

  // Menggabungkan tombol play/pause
  const playPauseButton = document.getElementById("play-pause-button");

  playPauseButton.addEventListener("click", function () {
    if (isPlaying) {
      sorting = false; // pause sorting
      playPauseButton.textContent = "▶ Play";
    } else {
      startSorting(); // start sorting
      playPauseButton.textContent = "⏸ Pause";
    }
    isPlaying = !isPlaying;
  });

  // Event listener untuk reset button
  document
    .getElementById("reset-button")
    .addEventListener("click", function () {
      sorting = false;
      isPlaying = false;
      playPauseButton.textContent = "▶ Play";
      initArray(arraySize);
    });

  // Slider untuk mengatur ukuran array
  document
    .getElementById("array-size-slider")
    .addEventListener("input", function (e) {
      arraySize = e.target.value;
      document.getElementById("array-size-label").textContent = arraySize;
      initArray(arraySize);
    });

  // Slider untuk mengatur kecepatan sorting
  document
    .getElementById("speed-slider")
    .addEventListener("input", function (e) {
      let maxSpeed = 100; // Kecepatan maksimal (lebih rendah lebih cepat)
      let minSpeed = 2000; // Kecepatan minimal (lebih tinggi lebih lambat)
      speed = minSpeed - (e.target.value / 100) * (minSpeed - maxSpeed);
      document.getElementById("speed-label").textContent = `${(
        speed / 1000
      ).toFixed(1)} sec/step`;
    });

  // Inisialisasi array awal
  initArray(arraySize);
});

("use strict");

const dropdownContent = document.querySelector(".dropdown");
const chevron = document.getElementById("chevron");
const playPauseButton = document.getElementById("play-pause-button");

let isPlaying = false;

function showMenu() {
  dropdownContent.classList.toggle("active");
  chevron.classList.toggle("rotate");
}

// Menggabungkan tombol play/pause
playPauseButton.addEventListener("click", function () {
  if (isPlaying) {
    sorting = false; // pause sorting
    playPauseButton.textContent = "▶ Play";
  } else {
    bubbleSort(); // start sorting
    playPauseButton.textContent = "⏸ Pause";
  }
  isPlaying = !isPlaying;
});

window.onclick = (event) => {
  if (!event.target.closest(".dropdown-button")) {
    dropdownContent.classList.remove("active");
    chevron.classList.remove("rotate");
  }
};
