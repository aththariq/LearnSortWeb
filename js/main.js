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
