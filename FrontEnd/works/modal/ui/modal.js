// Importation des fonctions nécessaires depuis api.js
import { getToken } from "../../api.js";
import { addWork } from "../usecases/add-work.js";
import { deleteWork } from "../usecases/delete-work.js";
import { fetchCategories } from "../../api.js";
import { afficherMessage } from "../../messages.js";

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
const gallery = document.getElementById("gallery");
const submitAjoutBtn = document.getElementById("submitAjoutBtn");
const overlay = document.getElementById("overlay");

// Éléments pour la modale d'ajout de photo
const backToGalleryBtn = document.getElementById("backToGalleryBtn");
const sectionAjoutPhoto = document.getElementById("section-ajout-photo");
const pictureIcon = document.getElementById("pictureIcon");
const fileUpload = document.getElementById("fileUpload");
const title = document.getElementById("photoTitle");
const uploadContainer = document.getElementById("uploadContainer");
const submitValidBtn = document.getElementById("submitValidBtn");
const selectCategory = document.getElementById("selectCategory");
const preview = document.getElementById("preview");
const helpText = document.querySelector(".helptext");

// Créer un bouton pour supprimer l'image sélectionnée
const removePreviewBtn = document.createElement("button");
removePreviewBtn.textContent = "Supprimer l'image";
removePreviewBtn.classList.add("removePreviewBtn");
removePreviewBtn.style.display = "none";

// Ajout du btn dans la modale
uploadContainer.appendChild(removePreviewBtn);

// Pour rendre le btn accessible dans les autres fichiers
export { removePreviewBtn };

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

  // Fermeture en cliquant en dehors de la modale, sur l'overlay
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
      sectionGallery.style.display = "block";
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
    fileUpload.value = ""; // Réinitialise le champ de fichier

    pictureIcon.style.display = "block";
    fileUpload.style.display = "none";
    helpText.style.display = "block";
    document.querySelector(".custom-file-upload").style.display = "flex";


    // Met à jour le bouton si on supprime la photo
    updateValidBtn();
  });

  // Fonction pour mettre à jour la couleur du bouton "Valider" si tous les champs sont remplis
  function updateValidBtn() {
    const titleWork = title.value.trim();
    const imgWork = fileUpload.files[0];
    const category = selectCategory.value.trim();

    if (imgWork && titleWork && category) {
      submitValidBtn.style.backgroundColor = "#1D6154";
      submitValidBtn.disabled = false;
    } else {
      submitValidBtn.style.backgroundColor = "#b3b3b3";
      submitValidBtn.disabled = true;
    }
  }

  //  Mets un écouteur sur chaque option
  title.addEventListener("input", updateValidBtn);
  fileUpload.addEventListener("change", updateValidBtn);
  selectCategory.addEventListener("change", updateValidBtn);

  // Fonction pour envoyer l'image et les infos à l'API
  submitValidBtn.addEventListener("click", async (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page

    const titleWork = title.value.trim();
    const imgWork = fileUpload.files[0];
    const category = selectCategory.value.trim();

    // Vérifie si tous les champs sont remplis
    if (!imgWork || !titleWork || !category) {
      afficherMessage("Veuillez remplir tous les champs !", "error");
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
  gallery.appendChild(figurePage);

  console.log("Nouvelle photo ajoutée à la galerie !");
};

// Ajoute l'export pour permettre l'importation dans add-work.js
export { displayCategories };
