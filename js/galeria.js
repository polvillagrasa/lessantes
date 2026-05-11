const filtreActe = document.getElementById("filtreActe");
const filtreData = document.getElementById("filtreData");
const cercaGaleria = document.getElementById("cercaGaleria");
const btnCercarGaleria = document.getElementById("btnCercarGaleria");
const gridGaleria = document.getElementById("gridGaleria");
const paginacioGaleria = document.getElementById("paginacioGaleria");

const modalGaleria = document.getElementById("modalGaleria");
const tancarModal = document.getElementById("tancarModal");
const modalImg = document.getElementById("modalImg");
const modalTitol = document.getElementById("modalTitol");
const modalData = document.getElementById("modalData");
const modalLloc = document.getElementById("modalLloc");

let actes = [];
let actesFiltrats = [];
let paginaActual = 1;
const elementsPerPagina = 8;

fetch("data/actes_santes_2025_pia.json")
  .then(resposta => resposta.json())
  .then(dades => {
    actes = dades.events.filter(acte => acte.images && acte.images.load_url);
    actesFiltrats = actes;

    crearFiltres();
    mostrarGaleria();
  })
  .catch(error => {
    gridGaleria.innerHTML = `
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

function obtenirImatge(acte) {
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

function crearFiltres() {
  const categories = [...new Set(actes.map(acte => obtenirCategoria(acte)))]
    .filter(Boolean)
    .sort();

  categories.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    filtreActe.appendChild(option);
  });

  const dies = [...new Set(actes.map(acte => obtenirDia(acte)))]
    .sort((a, b) => Number(a) - Number(b));

  dies.forEach(dia => {
    const option = document.createElement("option");
    option.value = dia;
    option.textContent = `${dia} Juliol`;
    filtreData.appendChild(option);
  });
}

function mostrarGaleria() {
  gridGaleria.innerHTML = "";

  if (actesFiltrats.length === 0) {
    gridGaleria.innerHTML = `
      <p class="missatge-buit">
        No s'ha trobat cap foto amb aquests filtres.
      </p>
    `;
    paginacioGaleria.innerHTML = "";
    return;
  }

  const inici = (paginaActual - 1) * elementsPerPagina;
  const final = inici + elementsPerPagina;
  const actesPagina = actesFiltrats.slice(inici, final);

  actesPagina.forEach(acte => {
    const card = document.createElement("article");
    card.className = "foto-card";

    card.innerHTML = `
      <img src="${obtenirImatge(acte)}" alt="${acte.title}">
      <div class="foto-info">
        <h3>${acte.title}</h3>
      </div>
    `;

    card.addEventListener("click", () => {
      obrirModal(acte);
    });

    gridGaleria.appendChild(card);
  });

  crearPaginacio();
}

function crearPaginacio() {
  paginacioGaleria.innerHTML = "";

  const totalPagines = Math.ceil(actesFiltrats.length / elementsPerPagina);

  if (totalPagines <= 1) {
    return;
  }

  const botoAnterior = document.createElement("button");
  botoAnterior.textContent = "‹";
  botoAnterior.disabled = paginaActual === 1;
  botoAnterior.addEventListener("click", () => {
    paginaActual--;
    mostrarGaleria();
  });
  paginacioGaleria.appendChild(botoAnterior);

  for (let i = 1; i <= totalPagines; i++) {
    if (i > 6) break;

    const boto = document.createElement("button");
    boto.textContent = i;

    if (i === paginaActual) {
      boto.className = "pagina-activa";
    }

    boto.addEventListener("click", () => {
      paginaActual = i;
      mostrarGaleria();
    });

    paginacioGaleria.appendChild(boto);
  }

  if (totalPagines > 6) {
    const punts = document.createElement("span");
    punts.textContent = "...";
    paginacioGaleria.appendChild(punts);

    const botoFinal = document.createElement("button");
    botoFinal.textContent = totalPagines;
    botoFinal.addEventListener("click", () => {
      paginaActual = totalPagines;
      mostrarGaleria();
    });
    paginacioGaleria.appendChild(botoFinal);
  }

  const botoSeguent = document.createElement("button");
  botoSeguent.textContent = "›";
  botoSeguent.disabled = paginaActual === totalPagines;
  botoSeguent.addEventListener("click", () => {
    paginaActual++;
    mostrarGaleria();
  });
  paginacioGaleria.appendChild(botoSeguent);
}

function filtrarGaleria() {
  const categoriaSeleccionada = filtreActe.value;
  const diaSeleccionat = filtreData.value;
  const text = cercaGaleria.value.toLowerCase().trim();

  actesFiltrats = actes.filter(acte => {
    const categoria = obtenirCategoria(acte);
    const dia = obtenirDia(acte);

    const coincideixCategoria =
      categoriaSeleccionada === "tots" || categoria === categoriaSeleccionada;

    const coincideixDia =
      diaSeleccionat === "tots" || dia === diaSeleccionat;

    const coincideixText =
      acte.title.toLowerCase().includes(text) ||
      acte.location.toLowerCase().includes(text) ||
      categoria.toLowerCase().includes(text) ||
      (acte.pretitle || "").toLowerCase().includes(text);

    return coincideixCategoria && coincideixDia && coincideixText;
  });

  paginaActual = 1;
  mostrarGaleria();
}

function obrirModal(acte) {
  modalImg.src = obtenirImatge(acte);
  modalImg.alt = acte.title;
  modalTitol.textContent = acte.title;
  modalData.textContent = `${obtenirDia(acte)} Juliol · ${obtenirHora(acte)}h`;
  modalLloc.textContent = acte.location;

  modalGaleria.classList.add("actiu");
}

function tancarModalGaleria() {
  modalGaleria.classList.remove("actiu");
}

btnCercarGaleria.addEventListener("click", filtrarGaleria);
filtreActe.addEventListener("change", filtrarGaleria);
filtreData.addEventListener("change", filtrarGaleria);
cercaGaleria.addEventListener("keyup", filtrarGaleria);

tancarModal.addEventListener("click", tancarModalGaleria);

modalGaleria.addEventListener("click", event => {
  if (event.target === modalGaleria) {
    tancarModalGaleria();
  }
});