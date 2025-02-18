import { ajoutPhotoApi } from "../../api.js";
import { ajoutPhotoGallery } from "../ui/modal.js" 

const form = document.getElementById("addImage");


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

      alert("Projet ajouté avec succès !");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo :", error);
  }
};
