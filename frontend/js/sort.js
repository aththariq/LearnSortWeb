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

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const algorithmFromURL = getQueryParam("algorithm");
  if (algorithmFromURL) {
    selectedAlgorithm = algorithmFromURL;
    document.getElementById("dropdown-text").textContent =
      algorithmFromURL.charAt(0).toUpperCase() + algorithmFromURL.slice(1) + " Sort";
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
      // Restore fillText to display numbers
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
      initialArray = array.slice(); // Use slice() to copy the array
    }
  }

  async function startSorting() {
    if (!sorting) {
      sorting = true;
      isPlaying = true;
      paused = false; // Ensure paused is false when starting
      playPauseButton.textContent = "⏸ Pause";
      resetClickCount = 0;

      if (selectedAlgorithm === "bubble") {
        await bubbleSort();
      } else if (selectedAlgorithm === "merge") {
        await mergeSort();
      } else if (selectedAlgorithm === "quick") {
        await quickSort();
      } else if (selectedAlgorithm === "heap") {
        await heapSort();
      }

      sorting = false;
      isPlaying = false;
      playPauseButton.textContent = "▶ Play";
    } else if (sorting && !paused) {
      // Pause if sorting and not already paused
      paused = true;
      playPauseButton.textContent = "▶ Play";
    } else if (sorting && paused) {
      // Resume if sorting and paused
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
        if (!sorting) return; // Exit if sorting is stopped
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
    if (!sorting) return; // Exit if sorting is stopped
    if (paused) await waitWhilePaused();
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    if (!sorting) return; // Exit after recursive call
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
      if (!sorting) return; // Exit if sorting is stopped
    }

    while (i < n1) {
      if (paused) await waitWhilePaused();
      arr[k] = L[i];
      i++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; // Exit if sorting is stopped
    }

    while (j < n2) {
      if (paused) await waitWhilePaused();
      arr[k] = R[j];
      j++;
      k++;
      drawArray(arr);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; // Exit if sorting is stopped
    }
  }

  // Quick Sort Logic
  async function quickSort(arr = array, left = 0, right = array.length - 1) {
    if (!sorting) return; // Exit if sorting is stopped
    if (paused) await waitWhilePaused();
    if (left >= right) return;

    let pivot = await partition(arr, left, right);
    await quickSort(arr, left, pivot - 1);
    if (!sorting) return; // Exit after recursive call
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
        if (!sorting) return; // Exit if sorting is stopped
      }
    }

    let temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;
    drawArray(arr);
    await new Promise((resolve) => setTimeout(resolve, speed));
    if (!sorting) return; // Exit if sorting is stopped

    return i + 1;
  }

  // Implement Heap Sort Logic
  async function heapSort() {
    sorting = true;
    let n = array.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0 && sorting; i--) {
      if (!sorting) return; // Exit if sorting is stopped
      if (paused) await waitWhilePaused();
      await heapify(array, n, i);
      if (!sorting) return; // Exit if sorting is stopped
    }

    // One by one extract elements
    for (let i = n - 1; i >= 0 && sorting; i--) {
      if (!sorting) return; // Exit if sorting is stopped
      if (paused) await waitWhilePaused();
      // Swap current root with end
      [array[0], array[i]] = [array[i], array[0]];
      drawArray(array);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (!sorting) return; // Exit if sorting is stopped

      // Call max heapify on the reduced heap
      await heapify(array, i, 0);
      if (!sorting) return; // Exit if sorting is stopped
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
      if (!sorting) return; // Exit if sorting is stopped
      await heapify(arr, n, largest);
    }
  }

  document.querySelectorAll(".dropdown-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      selectedAlgorithm = e.target.getAttribute("data-algorithm");

      document.getElementById("dropdown-text").textContent =
        e.target.textContent;

      // Tutup dropdown dan putar kembali chevron
      dropdownContent.classList.remove("active");
      chevron.classList.remove("rotate");
    });
  });

  function showMenu() {
    dropdownContent.classList.toggle("active");
    chevron.classList.toggle("rotate");
  }

  window.showMenu = showMenu;

  playPauseButton.addEventListener("click", function () {
    startSorting();
  });

  // Event listener untuk reset button
  document
    .getElementById("reset-button")
    .addEventListener("click", async function () {
      // Immediately stop any ongoing sorting
      sorting = false;
      paused = false;
      isPlaying = false;
  
      // Wait a brief moment to ensure all sorting operations have stopped
      await new Promise(resolve => setTimeout(resolve, 50));
  
      resetClickCount++;
      
      // Set a timeout to reset the click counter
      const timeoutId = setTimeout(() => {
        resetClickCount = 0;
      }, 300);
  
      if (resetClickCount === 1) {
        // Reset to the initial array
        console.log("Resetting to initial array.");
        array = initialArray.slice();
        drawArray(array);
        playPauseButton.textContent = "▶ Play";
        showNotification("Kembali ke initial array. Double click untuk menghasilkan array baru.");
      } else if (resetClickCount === 2) {
        // Clear the timeout to prevent resetting resetClickCount
        clearTimeout(timeoutId);
        
        // Generate completely new array
        console.log("Generating new array.");
        
        // Generate new array with current size
        array = Array.from({ length: arraySize }, () => 
          Math.floor(Math.random() * 100) + 1
        );
        
        // Update initial array
        initialArray = array.slice();
        
        // Update display
        drawArray(array);
        playPauseButton.textContent = "▶ Play";
        showNotification("Array baru telah diinisialisasi.");
        
        // Reset click counter immediately
        resetClickCount = 0;
      }
    });

  // Slider untuk mengatur ukuran array
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

  // Slider untuk mengatur kecepatan sorting
  document
    .getElementById("speed-slider")
    .addEventListener("input", function (e) {
      // Map the slider value (0.1 - 2) to the range of speed (2000 ms - 100 ms)
      let maxSpeed = 100; // Kecepatan maksimal (lebih rendah lebih cepat)
      let minSpeed = 2000; // Kecepatan minimal (lebih tinggi lebih lambat)

      // Correct formula to map the slider's min (0.1) to max (2) to speed range
      let sliderValue = parseFloat(e.target.value);
      speed =
        minSpeed - ((sliderValue - 0.1) / (2 - 0.1)) * (minSpeed - maxSpeed);

      // Update speed label with the new calculated speed
      document.getElementById("speed-label").textContent = `${(
        speed / 1000
      ).toFixed(1)} sec/step`;
    });

  // Inisialisasi array awal
  initArray(arraySize, true); // Save the initial array

  // Ensure window click listener is inside DOMContentLoaded
  window.onclick = function (event) {
    if (!event.target.closest(".dropdown-button")) {
      dropdownContent.classList.remove("active");
      chevron.classList.remove("rotate");
    }
  };

  // Helper function to wait while paused
  async function waitWhilePaused() {
    return new Promise((resolve) => {
      const check = () => {
        if (!sorting || !paused) {
          resolve();
        } else {
          setTimeout(check, 50); // Check more frequently
        }
      };
      check();
    });
  }
  function showNotification(message) {    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000); // The notification will disappear after 3 seconds
  }
});

