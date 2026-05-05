const map = L.map("map").setView([41.5381, 2.4445], 14);

// MAPA BASE
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

// MARCADORS
L.marker([41.5381, 2.4445]).addTo(map)
  .bindPopup("La Riera")
  .openPopup();

L.marker([41.5350, 2.4440]).addTo(map)
  .bindPopup("Parc Central");

L.marker([41.5340, 2.4500]).addTo(map)
  .bindPopup("Platja del Varador");

L.marker([41.5394, 2.4442]).addTo(map)
  .bindPopup("Plaça Santa Anna");