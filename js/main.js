function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

window.addEventListener(
  "scroll",
  throttle(function () {
    var header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, 100)
);

const scrollingWrapper = document.querySelector(".scrolling-wrapper");
const images = Array.from(scrollingWrapper.children);

function duplicateImages() {
  const totalWidth = scrollingWrapper.scrollWidth;
  const containerWidth = scrollingWrapper.clientWidth;

  const requiredDuplicates = Math.ceil(containerWidth / totalWidth);

  for (let i = 0; i < requiredDuplicates; i++) {
    images.forEach((img) => {
      const clone = img.cloneNode(true);
      scrollingWrapper.appendChild(clone);
    });
  }
}

duplicateImages();

document.querySelectorAll(".faq-question").forEach((item) => {
  item.addEventListener("click", (event) => {
    const faqItem = event.target.parentElement;

    faqItem.classList.toggle("active");

    document.querySelectorAll(".faq-item").forEach((otherItem) => {
      if (otherItem !== faqItem) {
        otherItem.classList.remove("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  steps.forEach((step) => {
    observer.observe(step);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetSection = document.querySelector(this.getAttribute("href"));

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 300);
        }
      });
    },
    { threshold: 0.5 }
  );

  steps.forEach((step) => observer.observe(step));
});

document.addEventListener("DOMContentLoaded", function () {
  const creatorMemo = document.querySelector(".creator-memo");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(creatorMemo);
});

document.getElementById("GetStarted").addEventListener("click", function () {
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Mencegah form dikirim secara default

      // Ambil nilai dari input
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Hanya menampilkan hasil untuk debugging, opsional
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);

      // Arahkan ke halaman main-page.html
      window.location.href = "main-page.html";
    });
});
