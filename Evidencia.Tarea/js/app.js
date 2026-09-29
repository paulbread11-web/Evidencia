let products = [];

const $ = id => document.getElementById(id);

async function load() {
	products = await fetch('data/productos.json').then(response => response.json());
	fillCategories();
	render();
	updateCartCount();
}

function fillCategories() {
	const categorySelect = $('category');
	const categories = [...new Set(products.map(product => product.categoria))].sort();

	categories.forEach(category => {
		categorySelect.innerHTML += `<option>${category}</option>`;
	});
}

function render() {
	const query = $('search').value.toLowerCase();
	const category = $('category').value;
	const minPrice = +$('minPrice').value || 0;
	const maxPrice = +$('maxPrice').value || Infinity;

	const filteredProducts = products.filter(product => {
		const matchesSearch =
			product.nombre.toLowerCase().includes(query) ||
			product.marca.toLowerCase().includes(query);
		const matchesCategory = category === 'Todos' || product.categoria === category;
		const matchesPrice = product.precio >= minPrice && product.precio <= maxPrice;

		return matchesSearch && matchesCategory && matchesPrice;
	});

	const sort = $('sort').value;

	if (sort === 'low') {
		filteredProducts.sort((a, b) => a.precio - b.precio);
	}

	if (sort === 'high') {
		filteredProducts.sort((a, b) => b.precio - a.precio);
	}

	if (sort === 'name') {
		filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}

	$('products').innerHTML = filteredProducts.map(product => `
		<article class="card">
			<img src="${product.imagen}" alt="${product.nombre}">
			<div class="card-body">
				<span class="tag">${product.categoria}</span>
				<h3>${product.nombre}</h3>
				<small>${product.marca}</small>
				<div class="price">
					$${product.precio.toLocaleString('es-MX')} MXN
				</div>
				<div class="actions">
					<a class="btn" href="producto.html?id=${product.id}&opcion=1">
						Ver producto
					</a>
					<button class="btn outline" onclick="add(${product.id}, 1)">
						🛒
					</button>
				</div>
			</div>
		</article>
	`).join('') || '<div class="empty">No encontramos productos con esos filtros.</div>';
}

function add(id, varId) {
	const product = products.find(item => item.id === id);
	const variant = product.variantes[varId - 1];
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');
	const key = id + '-' + varId;
	const item = cart.find(cartItem => cartItem.key === key);

	if (item) {
		item.cantidad++;
	} else {
		cart.push({
			key,
			id,
			varId,
			nombre: product.nombre,
			marca: product.marca,
			imagen: product.imagen,
			precio: variant.precio,
			variante: variant.nombre,
			cantidad: 1
		});
	}

	localStorage.setItem('techzone_cart', JSON.stringify(cart));
	updateCartCount();
}

function updateCartCount() {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');
	const count = cart.reduce((total, item) => total + item.cantidad, 0);

	if ($('cartCount')) {
		$('cartCount').textContent = count;
	}
}

['search', 'category', 'sort', 'minPrice', 'maxPrice'].forEach(id => {
	document.getElementById(id)?.addEventListener('input', render);
});

load();
