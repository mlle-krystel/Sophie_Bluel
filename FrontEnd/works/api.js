import { afficherMessage } from "./messages.js";

// Fonction qui permet de récupérer les travaux de l'API
export async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    console.log("Réponse API brute :", response); // Vérifie la réponse brute

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des tâches");
    }

    return await response.json(); // Retourne les travaux en JSON
  } catch (error) {
    afficherMessage("Impossible de charger les travaux !", "error");
    return []; // Retourne un tableau vide en cas d'erreur pour éviter un plantage
  }
}

// Fonction pour récupérer les catégories depuis l'API
export async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }

    return await response.json(); // Retourne les catégories en JSON
  } catch (error) {
    afficherMessage("Impossible de charger les catégories !", "error");
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Fonction de connexion (/users/login)
export async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return await response.json();
    }

    // Gestion des erreurs API
    if (response.status === 401) {
      afficherMessage("Email ou mot de passe incorrect !");
      return false;
    }

    if (response.status === 404) {
      afficherMessage("Utilisateur non trouvé !");
      return false;
    }

    throw new Error("Erreur inconnue lors de la connexion.");
  } catch (error) {
    afficherMessage("Erreur lors de la connexion !", "error");
    return false;
  }
}

// Fonction pour récupérer le token utilisateur
export function getToken() {
  return localStorage.getItem("token");
}

// Fonction pour supprimer un projet via l'API
export async function deleteProjet(projetID) {
  const token = getToken(); // Récupère le token utilisateur

  if (!token) {
    afficherMessage("Vous devez être connecté pour supprimer un projet !");
    return false;
  }

  try {
    const response = await fetch(
      `http://localhost:5678/api/works/${projetID}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }, // Envoie le token pour les identifiants
      }
    );

    if (response.ok) {
      console.log(`Le projet ${projetID} a bien été supprimé.`);
      return true; // Suppression réussie
    }

    if (response.status === 401) {
      afficherMessage("Vous n'êtes pas autorisé à supprimer ce projet.");
      localStorage.removeItem("token"); // Supprime le token invalide
      window.location.href = "login.html"; // Redirige vers la page de connexion
    } else if (response.status === 500) {
      afficherMessage("Comportement inattendu ! ");
    } else {
      afficherMessage("Impossible de supprimer ce projet.");
    }
  } catch (error) {
    afficherMessage("Impossible de supprimer ce projet !", "error");
    afficherMessage("Erreur inattendu.");
  }

  return false;
}

// Fonction pour ajouter une photo via l'API
export async function ajoutPhotoApi(formData) {
  // Récupère le token d'authentification stocké dans le localStorage
  const token = getToken();

  // Vérifie si l'utilisateur est bien connecté
  if (!token) {
    afficherMessage("Vous devez être connecté pour ajouter une photo !");

    //  Annule l'ajout si aucun token n'est trouvé
    return false; 
  }

  try {
    // Envoi de la requête POST à l'API pour ajouter la photo
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST", // Méthode d'envoi
      headers: {
        Authorization: `Bearer ${token}`, // Ajoute le token dans les headers
        //  NE PAS ajouter "Content-Type": "multipart/form-data" car FormData le gère automatiquement !
      },

      // Envoi des données du formulaire sous forme de FormData
      body: formData, 
    });

    // Vérifie si la requête a bien été acceptée par l'API
    if (response.ok) {
      console.log("Photo ajoutée avec succès !");
      afficherMessage("Projet ajouté avec succès !", "success");

      // Retourne la photo ajoutée sous forme d'objet JSON
      return await response.json(); 
    } else {
      afficherMessage("Erreur lors de l'ajout de la photo !");

      // Annule si la requête a échoué
      return false; 
    }
  } catch (error) {

    // Gestion des erreurs si la requête échoue (ex: problème serveur, connexion perdue, etc.)
    afficherMessage("Erreur inattendue !", "error");
    return false;
  }
}
