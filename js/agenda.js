const agendaContainer = document.getElementById("agendaContainer");

const selectCategoria = document.getElementById("selectCategoria");

const inputCerca = document.getElementById("inputCerca");

const btnFiltrar = document.getElementById("btnFiltrar");

const btnCerca = document.getElementById("btnCerca");

const botonsDies = document.getElementById("botonsDies");

let actes = [];

let diaActiu = "tots";

fetch("data/actes_santes_2025_pia.json")
  .then(resposta => resposta.json())
  .then(dades => {

    actes = dades.events;

    crearCategories();

    crearDies();

    mostrarActes(actes);

  });

function obtenirDia(acte) {
  return acte.date_initial.split(".")[0];
}

function obtenirHora(acte) {
  return acte.date_initial.split(" ")[1] || "";
}

function obtenirImatge(acte) {

  if (!acte.images || !acte.images.load_url) {
    return "img/focs.jpg";
  }

  let url = acte.images.load_url;

  if (url.startsWith("//")) {
    url = "https:" + url;
  }

  return url;
}

function obtenirCategoria(acte) {

  if (acte.ambits && acte.ambits.length > 0) {
    return acte.ambits[0].name;
  }

  if (acte.pretitle) {
    return acte.pretitle;
  }

  return "Altres";
}

function obtenirColorCategoria(categoria) {

  const text = categoria.toLowerCase();

  if (
    text.includes("foc") ||
    text.includes("correfoc")
  ) {
    return "vermell";
  }

  if (
    text.includes("concert") ||
    text.includes("música")
  ) {
    return "lila";
  }

  if (
    text.includes("tradicional") ||
    text.includes("gegants")
  ) {
    return "verd";
  }

  return "blau";
}

function crearCategories() {

  const categories = [
    ...new Set(
      actes.map(acte => obtenirCategoria(acte))
    )
  ].sort();

  categories.forEach(categoria => {

    const option = document.createElement("option");

    option.value = categoria;

    option.textContent = categoria;

    selectCategoria.appendChild(option);

  });

}

function crearDies() {

  const dies = [
    ...new Set(
      actes.map(acte => obtenirDia(acte))
    )
  ].sort((a,b)=>Number(a)-Number(b));

  dies.forEach(dia => {

    const boto = document.createElement("button");

    boto.className = "dia";

    boto.dataset.dia = dia;

    boto.textContent = dia;

    boto.addEventListener("click", () => {

      diaActiu = dia;

      document
        .querySelectorAll(".dia")
        .forEach(btn => btn.classList.remove("actiu"));

      boto.classList.add("actiu");

      filtrarActes();

    });

    botonsDies.appendChild(boto);

  });

}

function mostrarActes(llista) {

  agendaContainer.innerHTML = "";

  if (llista.length === 0) {

    agendaContainer.innerHTML = `
      <p class="missatge-buit">
        No s'ha trobat cap acte.
      </p>
    `;

    return;
  }

  const actesPerDia = {};

  llista.forEach(acte => {

    const dia = obtenirDia(acte);

    if (!actesPerDia[dia]) {
      actesPerDia[dia] = [];
    }

    actesPerDia[dia].push(acte);

  });

  Object.keys(actesPerDia)
    .sort((a,b)=>Number(a)-Number(b))
    .forEach(dia => {

      const section = document.createElement("section");

      section.className = "dia-section";

      section.innerHTML = `
        <h2>${dia} Juliol</h2>
        <div class="agenda-grid"></div>
      `;

      const grid = section.querySelector(".agenda-grid");

      actesPerDia[dia].forEach(acte => {

        const categoria = obtenirCategoria(acte);

        const colorCategoria =
          obtenirColorCategoria(categoria);

        const card = document.createElement("article");

        card.className = "agenda-card";

        card.innerHTML = `
          <img src="${obtenirImatge(acte)}">

          <span class="categoria ${colorCategoria}">
            ${categoria}
          </span>

          <div class="agenda-info">

            <h3>${acte.title}</h3>

            <p>
              ◷ ${obtenirHora(acte)}h
            </p>

            <p>
              📍 ${acte.location}
            </p>

          </div>
        `;

        grid.appendChild(card);

      });

      agendaContainer.appendChild(section);

    });

}

function filtrarActes() {

  const categoriaSeleccionada =
    selectCategoria.value;

  const text =
    inputCerca.value.toLowerCase().trim();

  const actesFiltrats = actes.filter(acte => {

    const categoria =
      obtenirCategoria(acte);

    const titol =
      acte.title.toLowerCase();

    const lloc =
      acte.location.toLowerCase();

    const dia =
      obtenirDia(acte);

    const coincideixCategoria =
      categoriaSeleccionada === "tots" ||
      categoria === categoriaSeleccionada;

    const coincideixText =
      titol.includes(text) ||
      lloc.includes(text) ||
      categoria.toLowerCase().includes(text);

    const coincideixDia =
      diaActiu === "tots" ||
      dia === diaActiu;

    return (
      coincideixCategoria &&
      coincideixText &&
      coincideixDia
    );

  });

  mostrarActes(actesFiltrats);

}

btnFiltrar.addEventListener(
  "click",
  filtrarActes
);

btnCerca.addEventListener(
  "click",
  filtrarActes
);

inputCerca.addEventListener(
  "keyup",
  filtrarActes
);