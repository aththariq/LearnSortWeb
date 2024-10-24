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
