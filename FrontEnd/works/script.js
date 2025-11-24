// je teste si le script est bien chargé
console.log("Le script est chargé !");

// importation de la fonction fetchWorks depuis le fichier api.js mais ne l'execute pas, on l'appelera plus tard avec la fonction chargerGalerie
import { fetchWorks } from "./api.js";

// importation de la fonction fetchCategories depuis le fichier api.js mais ne l'execute pas, on l'appelera plus tard avec la fonction afficherFiltres
import { fetchCategories } from "./api.js";
import { initModal } from "./modal/ui/modal.js";

import { getToken } from "./api.js";

function verifLogin() {
  const token = getToken();
  const editionMode = document.getElementById("editionMode");
  const openModalBtn = document.getElementById("openModal");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("loginBtn");
  const filtres = document.getElementById("filters");

  if (!token) {
    console.log("L'utilisateur n'est pas connecté en mode édition");
    if (editionMode) editionMode.style.display = "none";
    if (openModalBtn) openModalBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";
  } else {
    console.log("L'utilisateur est connecté en mode édition");
    if (editionMode) editionMode.style.display = "flex";
    if (openModalBtn) openModalBtn.removeAttribute("aria-hidden");
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
    if (filtres) filtres.style.display = "none";
  }
}


// Fonction pour afficher les projets dans la galerie
function afficherProjets(listProjets) {
  // Sélectionne l'élément HTML ayant l'id "gallery" pour y insérer les projets
  const gallery = document.getElementById("gallery");

  // Si "gallery" n'existe pas, affiche une erreur et arrête l'exécution de la fonction
  if (!gallery) {
    console.error("galerie introuvable");
    return;
  }

  // Verification de la réception des données
  console.log("Données bien reçues :", listProjets);

  // Réinitialise le contenu de la galerie en supprimant tout ce qui est déjà affiché
  gallery.innerHTML = "";

  // Parcourt la liste des projets reçue en paramètre
  
   
    listProjets.forEach((projet) => {
    const figure = document.createElement("figure");
    figure.dataset.id = projet.id;
    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = projet.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}



// Fonction pour afficher les boutons de filtres
function afficherFiltres(categories, listProjets) {
  try {
    // Sélectionne l'élément HTML ayant l'id "filters" pour y insérer les boutons de filtres
    const filtres = document.getElementById("filters");

    // Vérifie si l'élément "filters" existe dans le DOM
    // Si "filters" n'existe pas, affiche une erreur et arrête l'exécution de la fonction
    if (!filtres) {
      console.error("Erreur : Élément 'filters' introuvable dans le DOM.");
      return;
    }

   // Ajouter un bouton "Tous" pour afficher tous les projets
const btnTous = document.createElement("button");
btnTous.textContent = "Tous"; 
btnTous.classList.add("btnFiltres");
btnTous.classList.add("active"); // Le bouton "Tous" est actif par défaut
btnTous.addEventListener("click", () => {
  const btns = document.querySelectorAll(".btnFiltres");
  btns.forEach((btn) => btn.classList.remove("active")); // Désactive tous les boutons
  btnTous.classList.add("active"); // Active le bouton "Tous"
  afficherProjets(listProjets);
});
filtres.appendChild(btnTous);

// Parcourt chaque catégorie pour créer un bouton correspondant
categories.forEach((categorie) => {
  const btnCategories = document.createElement("button");
  btnCategories.textContent = categorie.name;
  btnCategories.classList.add("btnFiltres");

  btnCategories.addEventListener("click", () => {
    const btns = document.querySelectorAll(".btnFiltres");
    btns.forEach((btn) => btn.classList.remove("active")); // Désactive tous les boutons

    btnCategories.classList.add("active"); // Active le bouton cliqué

    console.log("Catégorie sélectionnée :", categorie.id);
    const galerieFiltre = listProjets.filter(
      (projet) => projet.categoryId === categorie.id
    );

    afficherProjets(galerieFiltre);
  });

  filtres.appendChild(btnCategories);
});

  } catch (error) {
    // Si une erreur survient (ex. : API inaccessible), affiche un message d'erreur dans la console
    console.error("Impossible d'afficher les filtres", error);
  }
}

const init = async () => {
  console.log("initialisation du code");

  verifLogin();
  
  // Récupère la liste des projets depuis l'API via la fonction fetchWorks
  const listProjets = await fetchWorks();

  // Récupère la liste des catégories depuis l'API via la fonction fetchCategories
  const categories = await fetchCategories();

  // Appels des fonctions pour charger la galerie et les filtres au démarrage
  afficherProjets(listProjets); // Charge tous les projets dans la galerie
  afficherFiltres(categories, listProjets); // Crée les boutons de filtres dynamiquement

  initModal(listProjets, categories);
};

init();
