// je teste si le script est bien chargé
console.log("Le script est chargé !");

// importation de la fonction fetchWorks depuis le fichier api.js mais ne l'execute pas, on l'appelera plus tard avec la fonction chargerGalerie
import { fetchWorks } from "./api.js";

// importation de la fonction fetchCategories depuis le fichier api.js mais ne l'execute pas, on l'appelera plus tard avec la fonction afficherFiltres
import { fetchCategories } from "./api.js";
import { initModal } from "./modal/ui/modal.js";

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
		// Crée un modèle HTML pour représenter chaque projet avec une image et un titre + figcaption qui permet d'ajouter une légende à l'image
		const modeleHTML = `
      <figure>
        <img src="${projet.imageUrl}" alt="${projet.title}">
        <figcaption>${projet.title}</figcaption>  
      </figure>
    `;

		// Crée un conteneur temporaire pour insérer le modèle HTML
		const conteneur = document.createElement("div");
		conteneur.innerHTML = modeleHTML;

		// Ajoute le contenu HTML dans l'élément "gallery" en prenant le premier enfant du conteneur
		gallery.appendChild(conteneur.firstElementChild);
	});
}

// Fonction pour afficher les boutons de filtres
async function afficherFiltres(categories, listProjets) {
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
		btnTous.textContent = "Tous"; // Définit le texte affiché dans le bouton
		btnTous.classList.add("btnFiltres"); // Ajoute une classe CSS pour le style
		btnTous.addEventListener("click", () => afficherProjets(listProjets)); // Ajoute un événement clic pour afficher tous les projets
		filtres.appendChild(btnTous); // Insère le bouton dans l'élément "filters"

		// Parcourt chaque catégorie pour créer un bouton correspondant
		categories.forEach((categorie) => {
			// Crée un bouton HTML pour la catégorie en cours
			const btnCategories = document.createElement("button");

			// Définit le texte du bouton avec le nom de la catégorie
			btnCategories.textContent = categorie.name;

			// Ajoute une classe CSS pour appliquer un style spécifique
			btnCategories.classList.add("btnFiltres");

			// Ajoute un événement clic au bouton pour afficher les projets de la catégorie correspondante
			btnCategories.addEventListener("click", async () => {
				// verifie si la liste des projets est bien récupérée
				console.log("Tous les projets :", listProjets);

				// Vérifie la catégorie selectionnée
				console.log("Catégorie sélectionnée :", categorie.id);

				// Filtre les projets pour ne garder que ceux de la catégorie en cours
				const galerieFiltree = listProjets.filter(
					(projet) => projet.categoryId === categorie.id,
				);

				// Affiche uniquement les projets filtrés dans la galerie
				afficherProjets(galerieFiltree);
			});

			// Ajoute le bouton dans l'élément "filters"
			filtres.appendChild(btnCategories);
		});
	} catch (error) {
		// Si une erreur survient (ex. : API inaccessible), affiche un message d'erreur dans la console
		console.error("Impossible d'afficher les filtres", error);
	}
}

const init = async () => {
	console.log("initialisation du code");
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
