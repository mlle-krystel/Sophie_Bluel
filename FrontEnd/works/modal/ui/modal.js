// Importation des fonctions nécessaires depuis api.js
import { getToken } from "../../api.js";
import { addWork } from "../usecases/add-work.js";
import { deleteWork } from "../usecases/delete-work.js";
import { fetchCategories } from "../../api.js";

// Récupération des éléments HTML nécessaires
const editionMode = document.getElementById("editionMode");
const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");
const modalGallery = document.getElementById("modalGallery");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const closeBtns = document.querySelectorAll(".closeBtn");
const filtres = document.getElementById("filters");
const sectionGallery = document.getElementById("section-gallery");
const submitAjoutBtn = document.getElementById("submitAjoutBtn");

// Éléments pour la modale d'ajout de photo
const backToGalleryBtn = document.getElementById("backToGalleryBtn");
const sectionAjoutPhoto = document.getElementById("section-ajout-photo");
const pictureIcon = document.getElementById("pictureIcon");
const fileUpload = document.getElementById("fileUpload");
const title = document.getElementById("photoTitle");
const UploadContainer = document.getElementById("UploadContainer");
const submitValidBtn = document.getElementById("submitValidBtn");
const selectCategory = document.getElementById("selectCategory");
const preview = document.getElementById("preview");
const addImageForm = document.getElementById("addImage");
const helpText = document.querySelector(".helptext");


// Créer un bouton pour supprimer l'image sélectionnée
const removePreviewBtn = document.createElement("button");
removePreviewBtn.textContent = "Supprimer l'image";
removePreviewBtn.style.display = "none";
removePreviewBtn.style.bottom = "-70px";
removePreviewBtn.style.position = "absolute";
removePreviewBtn.style.border = "none";
removePreviewBtn.style.background = "red";
removePreviewBtn.style.color = "white";
removePreviewBtn.style.cursor = "pointer";
// Ajout du btn dans la modale
UploadContainer.appendChild(removePreviewBtn);

// Vérifier si le script est bien chargé
console.log("Le script modal est chargé !");

// Fonction qui vérifie si l'utilisateur est connecté
async function verifLogin(editionMode, openModalBtn, logoutBtn, loginBtn) {
  const token = getToken();

  if (!token) {
    console.log("L'utilisateur n'est pas connecté en mode édition");
    editionMode.style.display = "none";
    openModalBtn.style.display = "none";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
  } else {
    console.log("L'utilisateur est connecté en mode édition");
    editionMode.style.display = "flex";
    openModalBtn.removeAttribute("aria-hidden");
    logoutBtn.style.display = "block";
    loginBtn.style.display = "none";
    filtres.style.display = "none";
  }
}

// TODO : Afficher les catégories dans le menu de filtres
const displayCategories = async () => {
  try {
    const categories = await fetchCategories(); // Récupération des catégories

    if (!selectCategory) {
      console.error("Le champ <select> pour les catégories est introuvable !");
      return;
    }

    // Réinitialisation du select
    selectCategory.innerHTML = `<option value="" disabled selected>Choisir une catégorie</option>`;

    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      selectCategory.appendChild(option);
    });

    console.log("Catégories chargées dans la modale !");
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
};

// Fonction pour charger la galerie
function galleriePourModal(listeProjets) {
  if (!modalGallery) {
    console.error("Modale introuvable.");
    return;
  }

  // Récupérer les projets via l'API
  // const listeProjets = await fetchWorks();

  // Réinitialisation du contenu de la galerie
  modalGallery.innerHTML = "";

  // Création de chaque projet avec suppression
  listeProjets.forEach((projet) => {
    const modeleHTML = `
    <figure data-id="${projet.id}">
      <img src="${projet.imageUrl}" alt="${projet.title}">
      <i class="fa-regular fa-trash-can deleteBtn" style="cursor: pointer;"></i>
    </figure>
  `;

    const conteneur = document.createElement("div");
    conteneur.innerHTML = modeleHTML;
    const figure = conteneur.firstElementChild;
    modalGallery.appendChild(figure);

    const deleteBtn = figure.querySelector(".deleteBtn");

    deleteBtn.addEventListener("click", async () => {
      const projetID = figure.getAttribute("data-id");

      deleteWork(projetID);
    });
  });

  console.log("Galerie modale mise à jour !");
}

// Attendre que le DOM soit complètement chargé avant d'exécuter le script
export const initModal = async (listeProjets) => {
  // chargement de la galerie
  galleriePourModal(listeProjets);

  // Fonction pour initialiser la liste des catégories
  await displayCategories();
  console.log("initialisation de la modal");

  // Vérifier si les éléments sont présent avant de vérifier si l'utilisateur est connecté et mettre à jour l'affichage

  if (editionMode && openModalBtn && logoutBtn && loginBtn) {
    verifLogin(editionMode, openModalBtn, logoutBtn, loginBtn);
  } else {
    console.error(
      "Un ou plusieurs éléments nécessaires à la vérification de connexion sont introuvables !"
    );
  }

  // Ouvrir la modale principale
  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.style.display = "block";
      overlay.style.display = "block";
      sectionAjoutPhoto.style.display = "none";
    });
  }

  // Fermeture des modales via les boutons X
  closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      sectionGallery.style.display = "block";
      sectionAjoutPhoto.style.display = "none";
      overlay.style.display = "none";
    });
  });

  // Fermeture en cliquant en dehors de la modale
  // Fermeture en cliquant sur l'overlay
  overlay.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  });

  //  Déconnexion utilisateur
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Déconnexion de l'utilisateur");
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }

  // Ouvrir la modale d'ajout de photo
  if (submitAjoutBtn) {
    submitAjoutBtn.addEventListener("click", (event) => {
      console.log("Ajout photo bouton cliqué !");
      event.preventDefault();
      sectionGallery.style.display = "none";
      sectionAjoutPhoto.style.display = "block";
      console.log(
        "sectionAjoutPhoto après clic : ",
        sectionAjoutPhoto.style.display
      );
    });
  }

  // Revenir à la galerie depuis la modale d'ajout
  if (backToGalleryBtn) {
    backToGalleryBtn.addEventListener("click", () => {
      sectionAjoutPhoto.style.display = "none";
      sectionGallery.style.display = "block";
    });
  }

  // Afficher l'aperçu de l'image sélectionnée
  fileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Affiche l'image sélectionnée
            preview.src = e.target.result;
            preview.style.display = "block"; 
            removePreviewBtn.style.display = "block";

            //  Cache tout ce qui concerne l'upload
            pictureIcon.style.display = "none";
            fileUpload.style.display = "none";
            helpText.style.display = "none";

            // Cache aussi le <label> (très important)
            document.querySelector(".custom-file-upload").style.display = "none";
        };

        reader.readAsDataURL(file);
    }
});


  // gestion du btn pour supprimer, si besoin, la photo sélectionée
  removePreviewBtn.addEventListener("click", () => {
    preview.src = "";
    preview.style.display = "none";
    removePreviewBtn.style.display = "none";
    fileUpload.value = ""; // Réinitialiser le champ de fichier

	pictureIcon.style.display = "block";
	fileUpload.style.display = "block";
	helpText.style.display = "block";

	fileUpload.value = "";
  });

  // Fonction pour envoyer l'image et les infos à l'API
  submitValidBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    const titleWork = title.value.trim();
    const imgWork = fileUpload.files[0];
    const category = selectCategory.value.trim();

    // Vérifie si tous les champs sont remplis
    if (!imgWork || !titleWork || !category) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    addWork({ title: titleWork, category, image: imgWork });
  });
};

export const ajoutPhotoGallery = (newPhoto) => {
  if (!newPhoto || !newPhoto.imageUrl || !newPhoto.title) {
    console.error("Données de la photo invalides :", newPhoto);
    return;
  }

  // Création de l'élément pour la modale
  const figureModal = document.createElement("figure");
  figureModal.setAttribute("data-id", newPhoto.id);
  figureModal.innerHTML = `
	  <img src="${newPhoto.imageUrl}" alt="${newPhoto.title}">
	  <i class="fa-regular fa-trash-can deleteBtn" style="cursor: pointer;"></i>
	`;

  // Ajout à la galerie de la modale
  modalGallery.appendChild(figureModal);

  // Ajouter la suppression dynamique
  figureModal
    .querySelector(".deleteBtn")
    .addEventListener("click", async () => {
      const projetID = figureModal.getAttribute("data-id");
      const deleted = await deleteWork(projetID);
      if (deleted) {
        figureModal.remove();
      }
    });

  // Création de l'élément pour la galerie principale
  const figurePage = document.createElement("figure");
  figurePage.setAttribute("data-id", newPhoto.id);
  figurePage.innerHTML = `
	  <img src="${newPhoto.imageUrl}" alt="${newPhoto.title}">
	  <figcaption>${newPhoto.title}</figcaption>
	`;

  // Ajout à la galerie principale
  sectionGallery.appendChild(figurePage);

  console.log("Nouvelle photo ajoutée à la galerie !");
};
