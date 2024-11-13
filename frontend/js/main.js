if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, 0);
  const header = document.querySelector("header");

  // Add a class to prevent initial transformation
  if (header) {
    header.classList.add("no-transform");
  }

  // Remove the class after a short delay
  setTimeout(() => {
    if (header) {
      header.classList.remove("no-transform");
    }
  }, 100);

  // Throttle function
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

  // Scroll event with throttle
  window.addEventListener(
    "scroll",
    throttle(function () {
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    }, 100)
  );

  // Check scroll position on load
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  // Duplicate images
  const scrollingWrapper = document.querySelector(".scrolling-wrapper");
  if (scrollingWrapper) {
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
  }

  // FAQ toggle
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

  // Intersection Observers for animations
  const steps = document.querySelectorAll(".step");
  if (steps.length) {
    const stepObserver = new IntersectionObserver(
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

    steps.forEach((step) => stepObserver.observe(step));
  }

  const creatorMemo = document.querySelector(".creator-memo");
  if (creatorMemo) {
    const memoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            memoObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    memoObserver.observe(creatorMemo);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute("href"));
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    });
  });

  // Button and form event listeners
  const getStartedButton = document.getElementById("GetStarted");
  if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      window.location.href = "main-page.html";
    });
  }

  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
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
  }

  const startLearningButton = document.getElementById("startlearning-button");
  if (startLearningButton) {
    startLearningButton.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
});
