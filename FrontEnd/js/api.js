// Récupération des projets grâce à fetch
async function call_api_works() {
	const response = await fetch('http://localhost:5678/api/works');
	const obj_data = await response.json();
	// console.log(obj_data);
	return obj_data;
}

async function call_api_categories() {
	const response = await fetch('http://localhost:5678/api/categories');
	const obj_data = await response.json();
	// console.log(obj_data);
	return obj_data;
}

// Récupération de la balise gallery
const gallery = document.querySelector('.gallery');

call_api_works().then(data => {
	console.log(data);
	for (let i = 0; i < data.length; i++) {
		const figure = document.createElement('figure');
		// <figure>
		// 			<img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
		// 			<figcaption>Abajour Tahina</figcaption>
		// 		</figure>

		const img = document.createElement('img');
		img.setAttribute('src', data[i].imageUrl);
		img.setAttribute('alt', data[i].title);
		const figcaption = document.createElement('figcaption');
		figcaption.innerHTML = data[i].title;

		figure.appendChild(img);
		figure.appendChild(figcaption);
		gallery.appendChild(figure);
	}
});
