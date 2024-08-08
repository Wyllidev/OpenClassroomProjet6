// Récupération des projets grâce à fetch
async function call_api_works() {
	const response = await fetch('http://localhost:5678/api/works');
	const obj_data = await response.json();
	// console.log(obj_data);
	return obj_data;
}

// Récupération des catégories grâce à fetch
async function call_api_categories() {
	const response = await fetch('http://localhost:5678/api/categories');
	const obj_data = await response.json();
	// console.log(obj_data);
	return obj_data;
}

// Séléctionne l'élément avec la classe ".gallery"
const gallery = document.querySelector('.gallery');

// Création d'un tableau pour stocker les items du menu
const object_menu_items = [];

// Séléctionne l'élément avec l'ID ".portfolio"
const portfolio = document.getElementById('portfolio');

// Création d'une div "object-menu" et lui ajoute l'ID portfolio
const object_menu = document.createElement('div');
object_menu.className = 'object-menu';
portfolio.appendChild(object_menu);

// Sélectionne la div "object-menu" créé précédemment et l'insère avant l'élément galerie dans le DOM
const objectMenu = document.querySelector('.object-menu');
gallery.parentNode.insertBefore(objectMenu, gallery);

// Création du filtre "Tous" et ajout d'un évènement au clic pour afficher tous les projets au chargement de la page
const object_menu_item_all = document.createElement('div');
object_menu_item_all.className = 'object';
object_menu_item_all.innerHTML = 'Tous';
object_menu.appendChild(object_menu_item_all);
object_menu_items.push(object_menu_item_all);
object_menu_item_all.addEventListener(
	'click',
	makeFilterFonction(object_menu_item_all),
);
object_menu_item_all.click();

// Appel de la fonction "call_api_categories", création d'une div "object" pour chaque catégorie et l'ajoute dans le tableau, ajout d'un évènement au clic pour exécuter la fonction qui filtre les catégories
call_api_categories().then(dataCategories => {
	if (dataCategories) {
		for (let i = 0; i < dataCategories.length; i++) {
			const object_menu_item = document.createElement('div');
			object_menu_item.className = 'object';
			object_menu_item.innerHTML = dataCategories[i].name;
			object_menu.appendChild(object_menu_item);
			object_menu_items.push(object_menu_item);
			object_menu_item.addEventListener(
				'click',
				makeFilterFonction(object_menu_item, dataCategories[i].id),
			);
		}
	}
});

function makeFilterFonction(object_menu_item, index) {
	return () => {
		// Vide le contenu de la galerie
		gallery.innerHTML = '';
		for (let i = 0; i < object_menu_items.length; i++) {
			// Retire la classe object-selected de tous les items du menu pour réinitialiser la sélection
			object_menu_items[i].classList.remove('object-selected');
		}
		// Ajoute la classe object-selected à l'item de menu cliqué
		object_menu_item.classList.add('object-selected');

		// Appel de la fonction "call_api_works"
		call_api_works().then(data => {
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				data[i].category.id;
				// Vérifie si l'index de la catégorie correspond à l'ID de la catégorie du projet actuel. Si oui, le projet est affiché
				if (!index || index == data[i].category.id) {
					const figure = document.createElement('figure');
					figure.setAttribute('data-id', data[i].id);

					const img = document.createElement('img');
					img.setAttribute('src', data[i].imageUrl);
					img.setAttribute('alt', data[i].title);
					const figcaption = document.createElement('figcaption');
					figcaption.innerHTML = data[i].title;

					figure.appendChild(img);
					figure.appendChild(figcaption);
					gallery.appendChild(figure);
				}
			}
		});
	};
}

//MODAL

const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modalContainer');

//  Afficher La Modal (bouton modifier)
const modalTrigger = document.getElementById('modal-trigger');

modalTrigger.addEventListener('click', function () {
	modal.style.display = 'block';
});

// Fermer la Modal
const exitModal = document.querySelectorAll('.btn-exit');
exitModal.forEach(exitButton =>
	exitButton.addEventListener('click', function () {
		modalAdd.style.display = 'none';
		modalGalery.style.display = 'flex';
		modal.style.display = 'none';
	}),
);

// Au clic en dehors de la modal fermeture de celle ci
window.addEventListener('click', function (event) {
	if (event.target === modalContainer) {
		modalGalery.style.display = 'flex';
		modalAdd.style.display = 'none';
		modal.style.display = 'none';
	}
});

// Passage de la modal gallery à la modal d'ajout de photos "ModalAdd" (bouton ajouter une photo)
const addPicture = document.querySelector('.btn-addWork');

addPicture.addEventListener('click', function () {
	modalGalery.style.display = 'none';
	modalAdd.style.display = 'block';
});

//Retour sur la modal "ModalGalery" (la flèche)
const returnModal = document.querySelector('.btn-back');

returnModal.addEventListener('click', function () {
	modalAdd.style.display = 'none';
	modalGalery.style.display = 'flex';
});

//MODAL GALERY

//-- Affichage des projets dans la Modal "ModalGalery"
function displayWorks(obj_data) {
	obj_data.forEach(returnImage => {
		addFigureToGaleryContainer(returnImage);
	});
}

// Appel API pour supprimer une image
async function deleteWork(workId) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			return;
		}
		console.log(workId, token);
		const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(response);
		if (response.ok) {
			console.log('Suppression réussie');
		} else {
			console.log("Une erreur s'est produite lors de la suppression");
		}
	} catch (error) {
		console.log("Une erreur s'est produite lors de la suppression", error);
	}
}

// Création de la galerie de photos
function addFigureToGaleryContainer(returnImage) {
	let galeryContainer = document.querySelector('.galeryContainer');
	if (!galeryContainer) {
		galeryContainer = document.createElement('div');
		galeryContainer.classList.add('galeryContainer');
		document.body.appendChild(galeryContainer);
	}
	const figure = document.createElement('figure');
	const img = document.createElement('img');

	img.src = returnImage.imageUrl;
	img.alt = returnImage.title;

	figure.appendChild(img);

	// Création d'une div qui contiendra les deux icones
	const iconsContainer = document.createElement('div');
	iconsContainer.classList.add('icons-container');
	// Icone pour gérer la taille des photos qui apparait au survol
	const resizeIcon = document.createElement('i');
	resizeIcon.classList.add(
		'fa-solid',
		'fa-arrows-up-down-left-right',
		'resize-ico',
	);
	iconsContainer.appendChild(resizeIcon);
	// Icone pour supprimer un projet de la galerie
	const deleteIcon = document.createElement('i');
	deleteIcon.classList.add('fa-solid', 'fa-trash-can');
	iconsContainer.appendChild(deleteIcon);
	figure.appendChild(iconsContainer);

	// Gestionnaire d'événement pour la suppression d'un élément
	deleteIcon.addEventListener('click', async () => {
		await deleteWork(returnImage.id);
		const data_id = document.querySelector(
			'[data-id="' + returnImage.id + '"]',
		);
		if (data_id) {
			data_id.remove();
		}
		figure.remove();
	});
	galeryContainer.appendChild(figure);
}
document.addEventListener('DOMContentLoaded', async () => {
	const obj_data = await call_api_works();
	if (obj_data) {
		displayWorks(obj_data);
	}
});

//MODAL ADD

// Gestion de l'image téléchargé ModalAdd
const changeFiles = document.getElementById('returnPreview');
const addImgElements = document.querySelectorAll(
	'.addImg i, .addImg label, .addImg input, .addImg p',
);
let image = document.getElementById('imagePreview');

let previewPicture = function (e) {
	const [picture] = e.files;
	if (picture) {
		// Affichage du preview (de l'image)
		image.src = URL.createObjectURL(picture);
		changeFiles.style.display = 'flex';
		// Cache les elements de la div
		addImgElements.forEach(element => {
			element.style.display = 'none';
		});
	}
};

// -- Bouton "bonus" pour retirer le preview et pouvoir changer d'image upload
let deletePreviewPicture = function () {
	image.src = '';
	changeFiles.style.display = 'none';
	addImgElements.forEach(element => {
		element.style.display = 'inline-block';
	});
	const inputUploadImg = document.getElementById('uploadImg');
	inputUploadImg.value = '';
};

changeFiles.addEventListener('click', deletePreviewPicture);

// Remplissage de tous les éléments pour ajouter un nouveau projet
async function getCategoriesforLabel() {
	const selectCategories = document.getElementById('categorie');
	try {
		const response = await fetch('http://localhost:5678/api/categories');
		const categoriesForLabel = await response.json();
		// Réinitialiser le contenu du select
		selectCategories.innerHTML = '';
		// Ajouter un champ vide
		const champVide = document.createElement('option');
		champVide.value = '';
		champVide.text = '';
		selectCategories.appendChild(champVide);
		// Parcourir les catégories et les ajouter au select
		categoriesForLabel.forEach(category => {
			if (category !== 'tous') {
				const optionnalCategories = document.createElement('option');
				optionnalCategories.value = category.id;
				optionnalCategories.text = category.name;
				selectCategories.appendChild(optionnalCategories);
			}
		});
	} catch (error) {
		console.error('Erreur lors de la récupération des catégories :', error);
	}
}
getCategoriesforLabel();

const formUploadWorks = document.getElementById('sendImg');
const submitBtnWorks = document.getElementById('btnSubmit');

// Envoie du projet dans la galerie
formUploadWorks.addEventListener('submit', submitWork);
function submitWork(e) {
	// évite le rechargement de la page
	e.preventDefault();
	// Récupère le token depuis le local Storage, si pas de token la fonction s'arrête
	let token = localStorage.getItem('token');
	if (!token) {
		return;
	}
	// Récupère les valeurs des champs : WebTransportBidirectionalStream, catégorie et image. Si l'un des champ est vide la fonction s'arrête
	let title = document.getElementById('titre').value;
	let category = document.getElementById('categorie').value;
	let image = document.getElementById('uploadImg').files[0];

	if (!title || !category || !image) {
		return;
	}
	// Crée un objet "FormData" pour encapsuler les données du formulaire
	let formData = new FormData();
	formData.append('title', title);
	formData.append('category', category);
	formData.append('image', image);
	// Envoie les données au serveur via une requête POST avec les données du formulaire comme corps de la requête
	fetch('http://localhost:5678/api/works', {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + token,
		},
		body: formData,
	})
		// Réponse de l'API :
		.then(async work => {
			// Affiche un message de succès dans la console
			console.log('Image envoyée avec succès !');
			// Ajoute l'image à la galerie via addFigureToGaleryContainer
			addFigureToGaleryContainer(await work.json());
			// Rafraîchit les catégories affichées via call_api_categories(0)
			call_api_categories(0);
			// Ferme la modale d'ajout (modalAdd) et affiche la galerie (modalGalery)
			modalAdd.style.display = 'none';
			modalGalery.style.display = 'flex';
			modal.style.display = 'none';
			// Réinitialise les champs du formulaire
			document.getElementById('titre').value = '';
			document.getElementById('categorie').value = '';
			image = document.getElementById('uploadImg').innerHTML = '';
			deletePreviewPicture();
			// Recharge la liste des images
			const categorieButton = document.querySelector('.object-selected');
			categorieButton.click();
		})
		// En cas d'erreur, affiche un message d'erreur dans la console
		.catch(error => {
			console.log("Erreur lors de l'envoi de l'image :", error);
		});
}
// Vérifie si tous les champs du formulaire sont remplis
function checkSubmitButton() {
	const errorMsgModal = document.querySelector('.errorModal');
	var title = document.getElementById('titre').value;
	var category = document.getElementById('categorie').value;
	var image = document.getElementById('uploadImg').files[0];
	// Si oui, active le bouton de soumission (submitBtnWorks)
	if (title && category && image) {
		submitBtnWorks.removeAttribute('disabled');
		submitBtnWorks.classList.add('active');
		errorMsgModal.textContent = '';
		// Si non, désactive le bouton et affiche un message d'erreur
	} else {
		submitBtnWorks.setAttribute('disabled', 'disabled');
		submitBtnWorks.classList.remove('active');
		errorMsgModal.textContent = 'Tous les champs doivent être remplis !';
	}
}
// Ajoute un évènementsur les champs du formulaire pour que la fonction checkSubmitButton soit appelée chaque fois que l'utilisateur modifie une valeur dans ces champs
document.getElementById('titre').addEventListener('input', checkSubmitButton);
document
	.getElementById('categorie')
	.addEventListener('change', checkSubmitButton);
document
	.getElementById('uploadImg')
	.addEventListener('change', checkSubmitButton);
