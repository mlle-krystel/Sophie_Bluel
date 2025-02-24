import { deleteProjet } from "../../api.js";
import { afficherMessage } from "../../messages.js";

export const deleteWork = async (projetID) => {
	// Demande de confirmation avant suppression
	const confirmation = confirm(
		"Êtes-vous sûr de vouloir supprimer ce projet ?",
	);
	if (!confirmation) return;

	const suppressionOK = await deleteProjet(projetID);

	if (suppressionOK) {
		console.log(`Suppression réussie du projet ${projetID}`);
		afficherMessage("Projet supprimé avec succès !", "success");

		const figures = document.querySelectorAll(`figure[data-id="${projetID}"]`);

		figures.forEach((figure) => {
			figure.remove();
		});
	} else {
		console.error(`Erreur lors de la suppression du projet ${projetID}`);
		alert("Erreur lors de la suppression du projet.");
	}
};
