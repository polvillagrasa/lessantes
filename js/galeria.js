const filtreActe = document.getElementById("filtreActe");
const filtreData = document.getElementById("filtreData");
const cercaGaleria = document.getElementById("cercaGaleria");
const btnCercarGaleria = document.getElementById("btnCercarGaleria");
const fotos = document.querySelectorAll(".foto-card");

function filtrarGaleria() {
  const acteSeleccionat = filtreActe.value;
  const diaSeleccionat = filtreData.value;
  const textCerca = cercaGaleria.value.toLowerCase();

  fotos.forEach(foto => {
    const acte = foto.dataset.acte;
    const dia = foto.dataset.dia;
    const titol = foto.querySelector("h3").textContent.toLowerCase();

    const coincideixActe = acteSeleccionat === "tots" || acte === acteSeleccionat;
    const coincideixDia = diaSeleccionat === "tots" || dia === diaSeleccionat;
    const coincideixText = titol.includes(textCerca);

    if (coincideixActe && coincideixDia && coincideixText) {
      foto.classList.remove("ocult");
    } else {
      foto.classList.add("ocult");
    }
  });
}

btnCercarGaleria.addEventListener("click", filtrarGaleria);
filtreActe.addEventListener("change", filtrarGaleria);
filtreData.addEventListener("change", filtrarGaleria);
cercaGaleria.addEventListener("keyup", filtrarGaleria);