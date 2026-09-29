const params = new URLSearchParams(location.search);
const id = Number(params.get('id'));
const option = Number(params.get('opcion') || 1);

async function init() {
	const products = await fetch('data/productos.json').then(response => response.json());
	const product = products.find(item => item.id === id);

	if (!product) {
		document.getElementById('detail').innerHTML = `
			<div class="empty">Producto no encontrado.</div>
		`;
		return;
	}

	const variant = product.variantes[option - 1] || product.variantes[0];

	document.title = product.nombre + ' | TechZone';
	document.getElementById('detail').innerHTML = `
		<div class="detail">
			<div>
				<img src="${product.imagen}" alt="${product.nombre}">
			</div>

			<div>
				<span class="tag">${product.categoria} · ${product.marca}</span>
				<h1>${product.nombre}</h1>
				<p>${product.descripcion}</p>

				<div class="big-price">
					$${variant.precio.toLocaleString('es-MX')} MXN
				</div>

				<h3>Elige una opción</h3>
				<div class="variants">
					${product.variantes.map((item, index) => `
						<button
							class="variant ${index + 1 === option ? 'active' : ''}"
							onclick="changeOption(${product.id}, ${index + 1})"
						>
							${item.nombre}<br>
							$${item.precio.toLocaleString('es-MX')}
						</button>
					`).join('')}
				</div>

				<div class="quantity">
					<label>Cantidad:</label>
					<input id="qty" type="number" min="1" value="1">
				</div>

				<div class="detail-actions">
					<button
						class="buy-btn"
						onclick="addProduct(${product.id}, ${variant.id})"
					>
						🛒 Agregar al carrito
					</button>
					<button
						class="buy-btn"
						style="background: #18a66a"
						onclick="buyNow(${product.id}, ${variant.id})"
					>
						Comprar ahora
					</button>
				</div>
			</div>
		</div>
	`;

	updateCount();
}

function changeOption(productId, selectedOption) {
	location.href = `producto.html?id=${productId}&opcion=${selectedOption}`;
}

function addProduct(productId, variantId) {
	const product = window.currentProducts?.find(item => item.id === productId);
	addFromData(productId, variantId, false);
}

async function addFromData(productId, variantId, buy) {
	const products = await fetch('data/productos.json').then(response => response.json());
	const product = products.find(item => item.id === productId);
	const variant = product.variantes[variantId - 1];
	const quantity = Number(document.getElementById('qty').value) || 1;
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');
	const key = productId + '-' + variantId;
	const item = cart.find(cartItem => cartItem.key === key);

	if (item) {
		item.cantidad += quantity;
	} else {
		cart.push({
			key,
			id: productId,
			varId: variantId,
			nombre: product.nombre,
			marca: product.marca,
			imagen: product.imagen,
			precio: variant.precio,
			variante: variant.nombre,
			cantidad: quantity
		});
	}

	localStorage.setItem('techzone_cart', JSON.stringify(cart));
	updateCount();

	if (buy) {
		location.href = 'carrito.html';
	}
}

function buyNow(productId, variantId) {
	addFromData(productId, variantId, true);
}

function updateCount() {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');
	const count = cart.reduce((total, item) => total + item.cantidad, 0);

	if (document.getElementById('cartCount')) {
		document.getElementById('cartCount').textContent = count;
	}
}

init();
