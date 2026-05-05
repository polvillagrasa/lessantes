const mapGeo = L.map("mapGeo").setView([41.5394, 2.4442], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(mapGeo);

const filtreDiaGeo = document.getElementById("filtreDiaGeo");
const llistaActivitatsGeo = document.getElementById("llistaActivitatsGeo");
const btnCentrar = document.getElementById("centrarMapa");

let actesGeo = [];
let marcadors = [];

fetch("data/actes_santes_2025_pia.json")
  .then(resposta => resposta.json())
  .then(dades => {
    actesGeo = dades.events.filter(acte => acte.location_point);
    crearDies();
    mostrarActivitatsMapa("tots");
  })
  .catch(error => {
    llistaActivitatsGeo.innerHTML = `
      <p class="missatge-buit">
        No s'ha pogut carregar el JSON. Revisa la ruta data/actes_santes_2025_pia.json
      </p>
    `;
    console.error(error);
  });

function obtenirDia(acte) {
  return acte.date_initial.split(".")[0];
}

function obtenirHora(acte) {
  return acte.date_initial.split(" ")[1] || "";
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

function netejarMarcadors() {
  marcadors.forEach(marcador => {
    mapGeo.removeLayer(marcador);
  });

  marcadors = [];
}

function crearLinkMaps(acte) {
  const cerca = `${acte.location}, Mataró`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cerca)}`;
}

function mostrarActivitatsMapa(diaSeleccionat) {
  netejarMarcadors();
  llistaActivitatsGeo.innerHTML = "";

  const actesFiltrats = actesGeo.filter(acte => {
    const dia = obtenirDia(acte);
    return diaSeleccionat === "tots" || dia === diaSeleccionat;
  });

  if (actesFiltrats.length === 0) {
    llistaActivitatsGeo.innerHTML = `
      <p class="missatge-buit">No hi ha activitats per aquest dia.</p>
    `;
    return;
  }

  const grupMarcadors = L.featureGroup();

  actesFiltrats.forEach((acte, index) => {
    const coords = acte.location_point;
    const urlMaps = crearLinkMaps(acte);

    const marcador = L.marker(coords).addTo(mapGeo);

    marcador.bindPopup(`
      <h3>${acte.title}</h3>
      <p><strong>${acte.location}</strong></p>
      <p>${obtenirDia(acte)} Juliol · ${obtenirHora(acte)}h</p>
      <a href="${urlMaps}" target="_blank">Com arribar-hi</a>
    `);

    marcadors.push(marcador);
    grupMarcadors.addLayer(marcador);

    const boto = document.createElement("button");
    boto.className = "activitat";

    boto.innerHTML = `
      <strong>${acte.title}</strong>
      <small>${obtenirHora(acte)}h · ${acte.location}</small>
    `;

    boto.addEventListener("click", () => {
      mapGeo.setView(coords, 17);
      marcador.openPopup();

      document.querySelectorAll(".activitat").forEach(b => b.classList.remove("activa"));
      boto.classList.add("activa");
    });

    llistaActivitatsGeo.appendChild(boto);

    if (index === 0) {
      boto.classList.add("activa");
      marcador.openPopup();
    }
  });

  if (actesFiltrats.length === 1) {
    mapGeo.setView(actesFiltrats[0].location_point, 16);
  } else {
    mapGeo.fitBounds(grupMarcadors.getBounds(), {
      padding: [40, 40]
    });
  }
}

filtreDiaGeo.addEventListener("change", () => {
  mostrarActivitatsMapa(filtreDiaGeo.value);
});

btnCentrar.addEventListener("click", () => {
  mostrarActivitatsMapa(filtreDiaGeo.value);
});