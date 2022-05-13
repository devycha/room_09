const shadowBoxes = document.querySelectorAll("#shadow-box");

function shadowRaise() {
  this.classList.add("shadow-lg");
  // this.classList.add('bg-secondary');
}

function shadowDown() {
  this.classList.remove("shadow-lg");
  // this.classList.remove('bg-secondary');
}

shadowBoxes.forEach((box) => box.addEventListener("mouseenter", shadowRaise));
shadowBoxes.forEach((box) => box.addEventListener("mouseleave", shadowDown));

// scroll to Top
const scrolltoTop = document.querySelector("#scrolltoTop");
const primaryNavbar = document.querySelector("#primary-navbar");

window.onscroll = () => {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 600
  ) {
    scrolltoTop.style.display = "block";
  } else {
    scrolltoTop.style.display = "none";
  }
}

scrolltoTop.addEventListener("click", () =>
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  })
);
