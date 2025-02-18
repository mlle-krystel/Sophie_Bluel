export const deleteWork = async (projetID) => {
	// Demande de confirmation avant suppression
	const confirmation = confirm(
		"Êtes-vous sûr de vouloir supprimer ce projet ?",
	);
	if (!confirmation) return;

	const suppressionOK = await deleteProjet(projetID);

	if (suppressionOK) {
		console.log(`Suppression réussie du projet ${projetID}`);
		figure.remove();

		// Actualisation de la galerie
		galleriePourModal(listeProjets);
	} else {
		console.error(`Erreur lors de la suppression du projet ${projetID}`);
		alert("Erreur lors de la suppression du projet.");
	}
};
