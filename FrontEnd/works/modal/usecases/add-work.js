import { ajoutPhotoApi } from "../../api.js";
import { ajoutPhotoGallery, removePreviewBtn } from "../ui/modal.js";
import { fetchCategories } from "../../api.js";
import { displayCategories } from "../ui/modal.js";

const pictureIcon = document.getElementById("pictureIcon");
const helpText = document.querySelector(".helptext");
const form = document.getElementById("addImage");
const fileUpload = document.getElementById("fileUpload");
const titleWork = document.getElementById("photoTitle");
const selectCategory = document.getElementById("selectCategory");
const preview = document.getElementById("preview");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");

export const addWork = async ({ title, category, image }) => {
  // Création de FormData pour envoyer à l'API
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const newPhoto = await ajoutPhotoApi(formData);
    if (newPhoto) {
      console.log("Photo ajoutée :", newPhoto);


      // Ajoute la nouvelle photo à la galerie
      ajoutPhotoGallery(newPhoto);


      // Réinitialise le formulaire
      form.reset();
      preview.src = "";
      preview.style.display = "none";
      titleWork.value = "";
      selectCategory.innerHTML = "";
      fileUpload.value = "";

      // Recharge les catégories
      await displayCategories();

      if (submitValidBtn) {
        submitValidBtn.style.backgroundColor = "#b3b3b3";
        submitValidBtn.disabled = true;
      }
      // Cache le bouton "Supprimer l'image"
      if (removePreviewBtn) {
        removePreviewBtn.style.display = "none";
      }

      // Réaffiche les éléments de l'upload
      pictureIcon.style.display = "block";
      fileUpload.style.display = "none";
      helpText.style.display = "block";
      selectCategory.style.display = "block";
      const customFileUpload = document.querySelector(".custom-file-upload").style.display = "flex";
      if (customFileUpload) {
        customFileUpload.style.display = "flex";

      }

      console.log("Fermeture de la modale...");
      if (modal && overlay) {
        modal.style.display = "none";
        overlay.style.display = "none";
      } else {
        console.error("La modale ou l'overlay est introuvable !");
      }
    }
  } catch (error) {
  }
};
