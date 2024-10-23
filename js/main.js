window.addEventListener("scroll", function () {
  var header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const scrollingWrapper = document.querySelector(".scrolling-wrapper");
const images = Array.from(scrollingWrapper.children);

function duplicateImages() {
  const totalWidth = scrollingWrapper.scrollWidth;

  while (scrollingWrapper.scrollWidth < totalWidth * 2) {
    images.forEach((img) => {
      const clone = img.cloneNode(true);
      scrollingWrapper.appendChild(clone);
    });
  }
}

duplicateImages();
