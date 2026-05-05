const ubicacions = {
  ara: {
    nom: "Actes Ara",
    lloc: "Plaça Santa Anna, Mataró",
    coords: [41.5394, 2.4442],
    url: "https://www.google.com/maps/search/?api=1&query=Plaça+Santa+Anna+Mataró"
  },
  cercavila: {
    nom: "Cercavila",
    lloc: "Can Marfà - Gènere de Punt, Mataró",
    coords: [41.5423, 2.4496],
    url: "https://www.google.com/maps/search/?api=1&query=Can+Marfà+Gènere+de+Punt+Mataró"
  },
  castells: {
    nom: "Castells",
    lloc: "Plaça Santa Anna, Mataró",
    coords: [41.5394, 2.4442],
    url: "https://www.google.com/maps/search/?api=1&query=Plaça+Santa+Anna+Mataró"
  },
  nitboja: {
    nom: "Nit Boja",
    lloc: "Ajuntament de Mataró",
    coords: [41.5399, 2.4449],
    url: "https://www.google.com/maps/search/?api=1&query=Ajuntament+de+Mataró"
  }
};

const mapGeo = L.map("mapGeo").setView([41.5394, 2.4442], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(mapGeo);

const marcadors = {};

Object.keys(ubicacions).forEach(clau => {
  const item = ubicacions[clau];

  marcadors[clau] = L.marker(item.coords)
    .addTo(mapGeo)
    .bindPopup(`
      <h3>${item.nom}</h3>
      <p>${item.lloc}</p>
      <a href="${item.url}" target="_blank">Com arribar-hi</a>
    `);
});

function mostrarUbicacio(clau) {
  const item = ubicacions[clau];

  mapGeo.setView(item.coords, 17);
  marcadors[clau].openPopup();

  document.querySelectorAll(".activitat").forEach(boto => {
    boto.classList.remove("activa");
  });

  document.querySelector(`[data-activitat="${clau}"]`).classList.add("activa");
}

document.querySelectorAll(".activitat").forEach(boto => {
  boto.addEventListener("click", () => {
    mostrarUbicacio(boto.dataset.activitat);
  });
});

document.getElementById("centrarMapa").addEventListener("click", () => {
  mapGeo.setView([41.5394, 2.4442], 15);
});

mostrarUbicacio("ara");