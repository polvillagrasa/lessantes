const map = L.map("map").setView([41.5394, 2.4442], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

const gridEspais = document.getElementById("gridEspais");

let marcadors = [];

fetch("data/actes_santes_2025_pia.json")
  .then(resposta => resposta.json())
  .then(dades => {
    const espais = obtenirEspaisDestacats(dades.events);
    mostrarEspais(espais);
    mostrarMarcadors(espais);
  })
  .catch(error => {
    gridEspais.innerHTML = `
      <p class="missatge-buit">
        No s'ha pogut carregar el JSON. Revisa que estigui a data/actes_santes_2025_pia.json
      </p>
    `;
    console.error(error);
  });

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

function obtenirHora(acte) {
  return acte.date_initial.split(" ")[1] || "";
}

function obtenirDia(acte) {
  return acte.date_initial.split(".")[0];
}

function crearLinkMaps(lloc) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lloc + ", Mataró")}`;
}

function obtenirEspaisDestacats(events) {
  const espaisMap = new Map();

  events.forEach(acte => {
    if (!acte.location || !acte.location_point) {
      return;
    }

    const nomEspai = acte.location.trim();

    if (!espaisMap.has(nomEspai)) {
      espaisMap.set(nomEspai, {
        nom: nomEspai,
        coords: acte.location_point,
        imatge: obtenirImatge(acte),
        actes: []
      });
    }

    espaisMap.get(nomEspai).actes.push(acte);
  });

  return [...espaisMap.values()]
    .sort((a, b) => b.actes.length - a.actes.length)
    .slice(0, 8);
}

function mostrarEspais(espais) {
  gridEspais.innerHTML = "";

  espais.forEach((espai, index) => {
    const card = document.createElement("article");
    card.className = "espai";

    const primerActe = espai.actes[0];

    card.innerHTML = `
      <img src="${espai.imatge}" alt="${espai.nom}">
      <div class="espai-info">
        <h3>${espai.nom}</h3>
        <p>
          ${espai.actes.length} activitat${espai.actes.length === 1 ? "" : "s"} programada${espai.actes.length === 1 ? "" : "es"}.
          Proper acte: ${obtenirDia(primerActe)} Juliol · ${obtenirHora(primerActe)}h
        </p>

        <div class="espai-botons">
          <button class="btn-mini" data-index="${index}">Veure al mapa</button>
          <a class="btn-link" href="${crearLinkMaps(espai.nom)}" target="_blank">Com arribar-hi ↗</a>
        </div>
      </div>
    `;

    gridEspais.appendChild(card);
  });

  document.querySelectorAll(".btn-mini").forEach(boto => {
    boto.addEventListener("click", () => {
      const index = Number(boto.dataset.index);
      const espai = espais[index];

      map.setView(espai.coords, 17);
      marcadors[index].openPopup();

      window.scrollTo({
        top: document.querySelector(".mapa-section").offsetTop - 80,
        behavior: "smooth"
      });
    });
  });
}

function mostrarMarcadors(espais) {
  marcadors.forEach(marcador => map.removeLayer(marcador));
  marcadors = [];

  const grup = L.featureGroup();

  espais.forEach(espai => {
    const htmlActes = espai.actes
      .slice(0, 4)
      .map(acte => `<li>${obtenirDia(acte)} Juliol · ${obtenirHora(acte)}h — ${acte.title}</li>`)
      .join("");

    const marcador = L.marker(espai.coords)
      .addTo(map)
      .bindPopup(`
        <h3>${espai.nom}</h3>
        <p>${espai.actes.length} activitats programades</p>
        <ul>${htmlActes}</ul>
        <a href="${crearLinkMaps(espai.nom)}" target="_blank">Com arribar-hi</a>
      `);

    marcadors.push(marcador);
    grup.addLayer(marcador);
  });

  if (espais.length === 1) {
    map.setView(espais[0].coords, 16);
  }

  if (espais.length > 1) {
    map.fitBounds(grup.getBounds(), {
      padding: [35, 35]
    });
  }
}