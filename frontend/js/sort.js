document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("sortCanvas");
  const ctx = canvas.getContext("2d");

  let array = [];
  let arraySize = 20;
  let sorting = false;
  let speed = 100;
  let selectedAlgorithm = "bubble";
  let swapped;
  let isPlaying = false;
  let paused = false;
  let resetClickCount = 0;
  let initialArray = [];
  const playPauseButton = document.getElementById("play-pause-button");
  const chevron = document.getElementById("chevron");
  const dropdownContent = document.querySelector(".dropdown-content");
  let currentAlgorithm = "bubbleSort";
  const dropdown = document.querySelector(".dropdown");

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const algorithmFromURL = getQueryParam("algorithm");
  if (algorithmFromURL) {
    selectedAlgorithm = algorithmFromURL;
    document.getElementById("dropdown-text").textContent =
      algorithmFromURL.charAt(0).toUpperCase() +
      algorithmFromURL.slice(1) +
      " Sort";
  }

  function drawArray(arr) {
    console.log("Drawing array:", arr);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = canvas.width / arr.length;

    ctx.font = "16px Arial";

    for (let i = 0; i < arr.length; i++) {
      const barHeight = arr[i] * 4;
      ctx.fillStyle = "#8fa3e8";
      ctx.fillRect(
        i * barWidth,
        canvas.height - barHeight,
        barWidth - 2,
        barHeight
      );
      ctx.fillStyle = "#444";
      ctx.fillText(
        arr[i],
        i * barWidth + barWidth / 4,
        canvas.height - barHeight - 10
      );
    }
  }

  function initArray(size, saveInitial = false) {
    array = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 100) + 1);
    }
    console.log("Initialized array:", array);
    drawArray(array);
    if (saveInitial) {
      initialArray = array.slice(); 
    }
  }

  async function startSorting() {
    if (!sorting) {
      sorting = true;
      isPlaying = true;
      paused = false; 
      playPauseButton.textContent = "⏸ Pause";
      resetClickCount = 0;

      if (selectedAlgorithm === "bubble") {
        await bubbleSort();
      } else if (selectedAlgorithm === "merge") {
        await mergeSort();
      } else if (selectedAlgorithm === "quick") {
        await quickSort();
        await heapSort();
      }

      sorting = false;
      isPlaying = false;
      playPauseButton.textContent = "▶ Play";
    } else if (sorting && !paused) {
      paused = true;
      playPauseButton.textContent = "▶ Play";
    } else if (sorting && paused) {
      paused = false;
      playPauseButton.textContent = "⏸ Pause";
    }
  }

  // Bubble Sort Logic
  async function bubbleSort() {
    sorting = true;
    do {
      swapped = false;
      for (let i = 0; i < array.length - 1; i++) {
        if (!sorting) return; 
        if (paused) await waitWhilePaused();
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
    if (!sorting) return;
    if (paused) await waitWhilePaused();
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    if (!sorting) return;
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
      if (paused) await waitWhilePaused();
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
      if (!sorting) return; 
    }

    while (i < n1) {
      if (paused) await waitWhilePaused();
      arr[k] = L[i];
      i++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; 
    }

    while (j < n2) {
      if (paused) await waitWhilePaused();
      arr[k] = R[j];
      j++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; 
    }
  }

  // Quick Sort Logic
  async function quickSort(arr = array, left = 0, right = array.length - 1) {
    if (!sorting) return; 
    if (paused) await waitWhilePaused();
    if (left >= right) return;

    let pivot = await partition(arr, left, right);
    await quickSort(arr, left, pivot - 1);
    if (!sorting) return; 
    await quickSort(arr, pivot + 1, right);
  }

  async function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      if (paused) await waitWhilePaused();
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        drawArray(arr);
        await new Promise((resolve) => setTimeout(resolve, speed));
        if (!sorting) return; 
      }
    }

    let temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;
    drawArray(arr);
    await new Promise((resolve) => setTimeout(resolve, speed));
    if (!sorting) return; 

    return i + 1;
  }

  // Implement Heap Sort Logic
  async function heapSort() {
    sorting = true;
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0 && sorting; i--) {
      if (!sorting) return;
      if (paused) await waitWhilePaused();
      await heapify(array, n, i);
      if (!sorting) return; 
    }

    // One by one extract elements
    for (let i = n - 1; i >= 0 && sorting; i--) {
      if (!sorting) return; 
      if (paused) await waitWhilePaused();
      [array[0], array[i]] = [array[i], array[0]];
      drawArray(array);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; 

      await heapify(array, i, 0);
      if (!sorting) return; 
    }
    sorting = false;
  }

  async function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i && sorting) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; 
      await heapify(arr, n, largest);
    }
  }

  document.querySelectorAll(".dropdown-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      selectedAlgorithm = e.target.getAttribute("data-algorithm");
      currentAlgorithm = e.target.getAttribute("data-algorithm") + "Sort";

      document.getElementById("dropdown-text").textContent =
        e.target.textContent;

      dropdown.classList.remove("active");
      chevron.classList.remove("rotate");
    });
  });

  function showMenu() {
    dropdown.classList.toggle("active"); 
    chevron.classList.toggle("rotate");
  }

  window.showMenu = showMenu;

  playPauseButton.addEventListener("click", function () {
    startSorting();
  });

  document
    .getElementById("reset-button")
    .addEventListener("click", async function () {
      sorting = false;
      paused = false;
      isPlaying = false;

      await new Promise((resolve) => setTimeout(resolve, 50));

      resetClickCount++;

      const timeoutId = setTimeout(() => {
        resetClickCount = 0;
      }, 300);

      if (resetClickCount === 1) {
        console.log("Resetting to initial array.");
        array = initialArray.slice();
        drawArray(array);
        playPauseButton.textContent = "▶ Play";
        showNotification(
          "Kembali ke initial array. Double click untuk menghasilkan array baru."
        );
      } else if (resetClickCount === 2) {
        clearTimeout(timeoutId);

        console.log("Generating new array.");

        array = Array.from(
          { length: arraySize },
          () => Math.floor(Math.random() * 100) + 1
        );

        initialArray = array.slice();

        drawArray(array);
        playPauseButton.textContent = "▶ Play";
        showNotification("Array baru telah diinisialisasi.");

        resetClickCount = 0;
      }
    });

  document
    .getElementById("array-size-slider")
    .addEventListener("input", function (e) {
      arraySize = e.target.value;
      document.getElementById("array-size-label").textContent = arraySize;
      sorting = false;
      isPlaying = false;
      playPauseButton.textContent = "▶ Play";
      initArray(arraySize, true);
      resetClickCount = 0;
    });

  document
    .getElementById("speed-slider")
    .addEventListener("input", function (e) {
      let maxSpeed = 100;
      let minSpeed = 2000; 

      let sliderValue = parseFloat(e.target.value);
      speed =
        minSpeed - ((sliderValue - 0.1) / (2 - 0.1)) * (minSpeed - maxSpeed);

      document.getElementById("speed-label").textContent = `${(
        speed / 1000
      ).toFixed(1)} sec/step`;
    });

  initArray(arraySize, true); 

  window.onclick = function (event) {
    if (!event.target.closest(".dropdown-button")) {
      dropdown.classList.remove("active");
      chevron.classList.remove("rotate");
    }
  };

  async function waitWhilePaused() {
    return new Promise((resolve) => {
      const check = () => {
        if (!sorting || !paused) {
          resolve();
        } else {
          setTimeout(check, 50); 
        }
      };
      check();
    });
  }
  function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  document
    .getElementById("explainButton")
    .addEventListener("click", async () => {
      let algorithmDescription = "";

      switch (currentAlgorithm) {
        case "bubbleSort":
          algorithmDescription =
            "Berikan penjelasan mendetail tentang **Bubble Sort** yang sedang divisualisasikan. Fokus pada cara kerja algoritma tanpa menyertakan contoh kode. Algoritma ini bekerja dengan berulang kali membandingkan elemen yang bersebelahan dan menukarnya jika urutannya salah. Proses ini diulangi hingga daftar benar-benar terurut.";
          break;
        case "quickSort":
          algorithmDescription =
            "Berikan penjelasan lengkap tentang **Quick Sort** yang sedang divisualisasikan. Jelaskan prinsip dasar algoritma, seperti pemilihan elemen pivot dan pembagian daftar, tanpa contoh kode. Algoritma ini membagi elemen-elemen ke dalam dua subarray berdasarkan nilai relatifnya terhadap pivot, lalu subarray diurutkan secara rekursif.";
          break;
        case "mergeSort":
          algorithmDescription =
            "Berikan penjelasan menyeluruh tentang **Merge Sort** yang sedang divisualisasikan. Jelaskan bagaimana algoritma membagi daftar menjadi sub-daftar dan menggabungkannya kembali tanpa contoh kode. Algoritma ini bekerja dengan membagi daftar yang belum terurut menjadi sub-daftar kecil, yang kemudian digabungkan berulang kali hingga daftar tersusun rapi.";
          break;
        default:
          algorithmDescription =
            "Berikan penjelasan mendetail tentang proses pengurutan yang terjadi di kanvas tanpa contoh kode.";
      }

      const explanationDiv = document.getElementById("explanation");
      explanationDiv.classList.remove("visible");
      explanationDiv.innerHTML = "";

      try {
        showNotification("Loading explanation...");

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization:
                "Bearer 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",
              "HTTP-Referer": "https://learn-sort-web.vercel.app/",
              "X-Title": "Learn Sort Web",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.2-3b-instruct:free",
              messages: [
                {
                  role: "user",
                  content: algorithmDescription,
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const markdownContent = data.choices[0].message.content;
        const htmlContent = marked.parse(markdownContent);
        const sanitizedContent = DOMPurify.sanitize(htmlContent);
        explanationDiv.innerHTML = sanitizedContent;

        explanationDiv.classList.add("visible");

        showNotification("Explanation loaded successfully.");
      } catch (error) {
        console.error("Error fetching explanation:", error);
        showNotification("Failed to load explanation.");
      }
    });
});
