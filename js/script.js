const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("actiu");

  if (menu.classList.contains("actiu")) {
    menuBtn.textContent = "×";
  } else {
    menuBtn.textContent = "☰";
  }
});