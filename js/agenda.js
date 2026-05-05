const botonsDies = document.querySelectorAll(".dia");
const seccionsDies = document.querySelectorAll(".dia-section");
const selectData = document.getElementById("selectData");
const inputCerca = document.getElementById("inputCerca");
const btnFiltrar = document.getElementById("btnFiltrar");
const btnCerca = document.getElementById("btnCerca");

function mostrarDia(diaSeleccionat) {
  seccionsDies.forEach(section => {
    if (section.dataset.dia === diaSeleccionat || diaSeleccionat === "tots") {
      section.classList.remove("ocult");
    } else {
      section.classList.add("ocult");
    }
  });

  botonsDies.forEach(boto => {
    boto.classList.toggle("actiu", boto.dataset.dia === diaSeleccionat);
  });
}

botonsDies.forEach(boto => {
  boto.addEventListener("click", () => {
    mostrarDia(boto.dataset.dia);
    selectData.value = boto.dataset.dia;
  });
});

btnFiltrar.addEventListener("click", () => {
  mostrarDia(selectData.value);
});

btnCerca.addEventListener("click", cercarActe);
inputCerca.addEventListener("keyup", cercarActe);

function cercarActe() {
  const text = inputCerca.value.toLowerCase();
  const cards = document.querySelectorAll(".agenda-card");

  cards.forEach(card => {
    const titol = card.querySelector("h3").textContent.toLowerCase();

    if (titol.includes(text)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}