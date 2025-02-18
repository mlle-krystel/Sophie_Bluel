// fichier dédié à la gestion des interactions liées au formulaire de connexion
import { loginUser } from "./api.js"; // 

// je teste si le script est bien chargé
console.log("Le script login est chargé !");

// Attente que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");

  // Écoute de l'événement submit
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupère les valeurs des champs en ajoutant .trim pour enlever les espaces
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();

    // Vérifie que les champs ne sont pas vides
    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Appeler la fonction loginUser
      const user = await loginUser(email, password);

     
//  Stocker le token dans le localStorage si la connexion réussit
        if (user && user.token) { 
          console.log("Token bien reçu, redirection !");
          // Stocker le token dans le localStorage si la connexion réussit
          localStorage.setItem("token", user.token);

          // Rediriger l'utilisateur vers la page d'accueil
          window.location.href = "index.html";
        } else {
          alert("Erreur dans l’identifiant ou le mot de passe");
        }
      
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  });
});

