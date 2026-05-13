const figures = [
  {
    id: "robafaves",
    nom: "Robafaves",
    imatge: "img/robafaves.jpg"
  },
  {
    id: "aguila",
    nom: "Àliga",
    imatge: "img/aguila.jpeg"
  },
  {
    id: "geganta",
    nom: "Geganta",
    imatge: "img/geganta.jpg"
  },
  {
    id: "manelo",
    nom: "Maneló",
    imatge: "img/maneló.jpg"
  },
  {
    id: "dragalio",
    nom: "Dragalió",
    imatge: "img/dragalio.jpeg"
  },
  {
    id: "drac",
    nom: "Drac",
    imatge: "img/drac.jpeg"
  },
  {
    id: "toneta",
    nom: "Toneta",
    imatge: "img/toneta.jpeg"
  },
  {
    id: "momarota",
    nom: "Momerota",
    imatge: "img/momarota.jpeg"
  }
];

const imatgesGrid = document.getElementById("imatgesGrid");
const nomsGrid = document.getElementById("nomsGrid");
const missatgeJoc = document.getElementById("missatgeJoc");
const encertsText = document.getElementById("encerts");
const reiniciarJoc = document.getElementById("reiniciarJoc");

let imatgeSeleccionada = null;
let encerts = 0;

function barrejar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function iniciarJoc() {
  imatgesGrid.innerHTML = "";
  nomsGrid.innerHTML = "";
  imatgeSeleccionada = null;
  encerts = 0;
  encertsText.textContent = encerts;

  missatgeJoc.className = "missatge";
  missatgeJoc.innerHTML = "<p>Comença triant una foto 👀</p>";

  barrejar(figures).forEach(figura => {
    const card = document.createElement("button");
    card.className = "gegant-card";
    card.dataset.id = figura.id;

    card.innerHTML = `
      <img src="${figura.imatge}" alt="${figura.nom}">
    `;

    card.addEventListener("click", () => seleccionarImatge(card, figura));

    imatgesGrid.appendChild(card);
  });

  barrejar(figures).forEach(figura => {
    const nom = document.createElement("button");
    nom.className = "nom-card";
    nom.dataset.id = figura.id;
    nom.textContent = figura.nom;

    nom.addEventListener("click", () => seleccionarNom(nom, figura));

    nomsGrid.appendChild(nom);
  });
}

function seleccionarImatge(card, figura) {
  if (card.classList.contains("correcte")) return;

  document.querySelectorAll(".gegant-card").forEach(element => {
    element.classList.remove("seleccionat");
  });

  card.classList.add("seleccionat");
  imatgeSeleccionada = {
    id: figura.id,
    card: card
  };

  missatgeJoc.className = "missatge";
  missatgeJoc.innerHTML = "<p>Molt bé! Ara tria el nom correcte ✨</p>";
}

function seleccionarNom(card, figura) {
  if (card.classList.contains("correcte")) return;

  if (!imatgeSeleccionada) {
    missatgeJoc.className = "missatge error";
    missatgeJoc.innerHTML = "<p>Primer has de tocar una foto 😊</p>";
    return;
  }

  if (imatgeSeleccionada.id === figura.id) {
    card.classList.add("correcte");
    imatgeSeleccionada.card.classList.add("correcte");
    imatgeSeleccionada.card.classList.remove("seleccionat");

    encerts++;
    encertsText.textContent = encerts;

    missatgeJoc.className = "missatge correcte";
    missatgeJoc.innerHTML = `<p>Correcte! Has trobat ${figura.nom}! 🎉</p>`;

    imatgeSeleccionada = null;

    if (encerts === figures.length) {
      missatgeJoc.className = "missatge correcte";
      missatgeJoc.innerHTML = "<p>Genial! Has relacionat totes les figures de Les Santes! 🥳</p>";
    }

  } else {
    card.classList.add("error");
    imatgeSeleccionada.card.classList.add("error");

    missatgeJoc.className = "missatge error";
    missatgeJoc.innerHTML = "<p>Ui! Torna-ho a provar, segur que ho aconsegueixes 💪</p>";

    setTimeout(() => {
      card.classList.remove("error");
      imatgeSeleccionada.card.classList.remove("error");
    }, 500);
  }
}

reiniciarJoc.addEventListener("click", iniciarJoc);

iniciarJoc();