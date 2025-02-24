// Fonction pour afficher un message d'erreur ou de succès
export const afficherMessage = (message, type) => {
    let messageBox;

    // Vérifie sur quelle page on est et sélectionne le bon msg-box
    if (document.getElementById("loginForm")) {
        messageBox = document.getElementById("msgLogin"); // Message pour la page de login
    }
    else if (document.getElementById("section-ajout-photo")?.style.display === "block") {
        messageBox = document.getElementById("msgAjout"); // Message pour l'ajout de photo
    }
    else {
        messageBox = document.getElementById("msgBox"); // Message pour la galerie principale
    }

    if (!messageBox) {
        console.error("Aucun msg-box trouvé !");
        return;
    }

    // Met à jour le contenu du message
    messageBox.textContent = message;

    // Retire toutes les classes avant d'ajouter la nouvelle
    messageBox.classList.remove("hidden", "error", "success");

    // Ajoute la bonne classe selon le type de message
    if (type === "error") {
        messageBox.classList.add("error");

    } else {
        messageBox.classList.add("success");

    }

    // Affiche le message
    messageBox.style.display = "block";

    // Cacher après 5 secondes
    setTimeout(() => {
        messageBox.classList.add("hidden");
        messageBox.style.display = "none"; // Assure que le message est bien caché
    }, 5000);
};
