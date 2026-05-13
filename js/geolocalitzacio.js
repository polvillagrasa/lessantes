const mapGeo = L.map("mapGeo").setView([41.5394, 2.4442], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(mapGeo);

const filtreDiaGeo = document.getElementById("filtreDiaGeo");
const filtreCategoriaGeo = document.getElementById("filtreCategoriaGeo");
const llistaActivitatsGeo = document.getElementById("llistaActivitatsGeo");
const btnCentrar = document.getElementById("centrarMapa");

let actesGeo = [];
let marcadors = [];
let actesFiltratsActuals = [];

fetch("data/actes_santes_2025_pia.json")
  .then(resposta => resposta.json())
  .then(dades => {
    actesGeo = dades.events.filter(acte => acte.location_point);
    crearDies();
    crearCategories();
    mostrarActivitatsMapa();
  });

function obtenirDia(acte) {
  return acte.date_initial.split(".")[0];
}

function obtenirHora(acte) {
  return acte.date_initial.split(" ")[1] || "";
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

function crearDies() {
  const dies = [...new Set(actesGeo.map(acte => obtenirDia(acte)))]
    .sort((a, b) => Number(a) - Number(b));

  dies.forEach(dia => {
    const option = document.createElement("option");
    option.value = dia;
    option.textContent = `${dia} Juliol`;
    filtreDiaGeo.appendChild(option);
  });
}

function crearCategories() {
  const categories = [...new Set(actesGeo.map(acte => obtenirCategoria(acte)))]
    .sort();

  categories.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    filtreCategoriaGeo.appendChild(option);
  });
}

function netejarMarcadors() {
  marcadors.forEach(marcador => {
    mapGeo.removeLayer(marcador);
  });

  marcadors = [];
}

function crearLinkMaps(acte) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acte.location + ", Mataró")}`;
}

function seleccionarActivitat(index, moureMapa = true) {
  const acte = actesFiltratsActuals[index];
  const marcador = marcadors[index];

  if (!acte || !marcador) return;

  document.querySelectorAll(".activitat").forEach(boto => {
    boto.classList.remove("activa");
  });

  const botoSeleccionat = document.querySelector(`.activitat[data-index="${index}"]`);

  if (botoSeleccionat) {
    botoSeleccionat.classList.add("activa");
    botoSeleccionat.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  if (moureMapa) {
    mapGeo.setView(acte.location_point, 17);
  }

  marcador.openPopup();
}

function mostrarActivitatsMapa() {
  netejarMarcadors();
  llistaActivitatsGeo.innerHTML = "";

  const diaSeleccionat = filtreDiaGeo.value;
  const categoriaSeleccionada = filtreCategoriaGeo.value;

  actesFiltratsActuals = actesGeo.filter(acte => {
    const coincideixDia =
      diaSeleccionat === "tots" || obtenirDia(acte) === diaSeleccionat;

    const coincideixCategoria =
      categoriaSeleccionada === "tots" || obtenirCategoria(acte) === categoriaSeleccionada;

    return coincideixDia && coincideixCategoria;
  });

  if (actesFiltratsActuals.length === 0) {
    llistaActivitatsGeo.innerHTML = `
      <p class="missatge-buit">No hi ha activitats amb aquests filtres.</p>
    `;
    return;
  }

  const grupMarcadors = L.featureGroup();

  actesFiltratsActuals.forEach((acte, index) => {
    const marcador = L.marker(acte.location_point).addTo(mapGeo);

    marcador.bindPopup(`
      <h3>${acte.title}</h3>
      <p><strong>${acte.location}</strong></p>
      <p>${obtenirDia(acte)} Juliol · ${obtenirHora(acte)}h</p>
      <p>${obtenirCategoria(acte)}</p>
      <a href="${crearLinkMaps(acte)}" target="_blank">Com arribar-hi</a>
    `);

    marcador.on("click", () => {
      seleccionarActivitat(index, false);
    });

    marcadors.push(marcador);
    grupMarcadors.addLayer(marcador);

    const boto = document.createElement("button");
    boto.className = "activitat";
    boto.dataset.index = index;

    boto.innerHTML = `
      <strong>${acte.title}</strong>
      <small>${obtenirHora(acte)}h · ${acte.location}</small>
      <small>${obtenirCategoria(acte)}</small>
    `;

    boto.addEventListener("click", () => {
      seleccionarActivitat(index, true);
    });

    llistaActivitatsGeo.appendChild(boto);
  });

  if (actesFiltratsActuals.length === 1) {
    mapGeo.setView(actesFiltratsActuals[0].location_point, 16);
  } else {
    mapGeo.fitBounds(grupMarcadors.getBounds(), {
      padding: [40, 40]
    });
  }

  seleccionarActivitat(0, false);
}

filtreDiaGeo.addEventListener("change", mostrarActivitatsMapa);
filtreCategoriaGeo.addEventListener("change", mostrarActivitatsMapa);

btnCentrar.addEventListener("click", mostrarActivitatsMapa);