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

const object_menu_items = [];

const portfolio = document.getElementById('portfolio');
const object_menu = document.createElement('div');
object_menu.className = 'object-menu';
portfolio.appendChild(object_menu);

const objectMenu = document.querySelector('.object-menu');
gallery.parentNode.insertBefore(objectMenu, gallery);

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
		gallery.innerHTML = '';
		for (let i = 0; i < object_menu_items.length; i++) {
			object_menu_items[i].classList.remove('object-selected');
		}
		object_menu_item.classList.add('object-selected');

		call_api_works().then(data => {
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				data[i].category.id;
				if (!index || index == data[i].category.id) {
					const figure = document.createElement('figure');

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
