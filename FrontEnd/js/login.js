const form_log = document.getElementById('form-input');
if (form_log) {
	form_log.addEventListener('submit', function (event) {
		// Empeche la page de se rafraichir au clic
		event.preventDefault();
		// Récucpère email et password
		const inputEmail = document.getElementById('email');
		const inputPassword = document.getElementById('password');
		// Récupère la valeur entrée dans email et password
		const email = inputEmail.value;
		const password = inputPassword.value;
		call_api_log(email, password);
	});
}

async function call_api_log(inputEmail, inputPassword) {
	const BodyJson = JSON.stringify({
		email: inputEmail,
		password: inputPassword,
	});
	// Envoi de la requête POST à l'API
	const response = await fetch('http://localhost:5678/api/users/login', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: BodyJson,
	});

	// Création du message d'erreur
	const responseJson = await response.json();
	const errorMessage = document.getElementById('error-msg-login');
	if (responseJson.token === undefined) {
		errorMessage.textContent = 'E-mail ou Mot de passe incorrect';
	} else {
		// Création du localstorage pour stocker le token
		localStorage.setItem('token', responseJson.token);
		// Redirection vers la page index.html
		window.location.href = 'index.html';
	}
}

// Gestion de la connexion
window.addEventListener('DOMContentLoaded', function () {
	// Séléctionne les éléments login et logout grâce à leur ID
	const loginLink = document.getElementById('login');
	const logoutLink = document.getElementById('logout');

	//-- Afficher les boutons "btn-modifier" pour la modal (bouton modifier)
	const btnModifier = document.querySelector('.btn-modifier');

	// -- Afficher la div "container-edit" pour la modal (mode édition)
	const containerEdit = document.querySelector('.container-edit');

	// Vérifie si un élément token existe dans le localStorage
	if (localStorage.getItem('token')) {
		// Si un token existe, cache le lien de connexion en le réglant sur 'none'
		loginLink.style.display = 'none';
		// Affiche le lien de déconnexion en le réglant sur 'inline-block'
		logoutLink.style.display = 'inline-block';
		// Affiche le bouton modifier et le mode edition
		btnModifier.style.display = 'flex';
		containerEdit.style.display = 'flex';
		// Ajout d'un évènement au clic sur le lien pour se déconnecter
		logoutLink.addEventListener('click', function () {
			localStorage.removeItem('token');
			// Retire si pas de token le bouton modifier et le mode edition
			btnModifier.style.display = 'none';
			containerEdit.style.display = 'none';
		});
	} else {
		if (loginLink && logoutLink) {
			// Retire "logout" à la deconnexion
			logoutLink.style.display = 'none';
		}
	}
});
