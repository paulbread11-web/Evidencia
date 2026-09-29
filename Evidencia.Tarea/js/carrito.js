function money(amount) {
	return '$' + amount.toLocaleString('es-MX') + ' MXN';
}

function render() {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');
	const cartElement = document.getElementById('cart');

	if (!cart.length) {
		cartElement.innerHTML = `
			<div class="empty">
				<h2>Tu carrito está vacío 🛒</h2>
				<p>Agrega algún componente para comenzar.</p>
				<a class="btn" href="index.html#productos">Ver productos</a>
			</div>
		`;
		return;
	}

	const subtotal = cart.reduce(
		(total, item) => total + item.precio * item.cantidad,
		0
	);
	const shipping = subtotal >= 3000 ? 0 : 149;
	const total = subtotal + shipping;

	const itemsHtml = cart.map((item, index) => `
		<div class="cart-item">
			<img src="${item.imagen}" alt="${item.nombre}">
			<div class="grow">
				<strong>${item.nombre}</strong><br>
				<small>${item.marca} · ${item.variante}</small>
				<p>${money(item.precio)} × ${item.cantidad}</p>
			</div>
			<input
				type="number"
				min="1"
				value="${item.cantidad}"
				onchange="qty(${index}, this.value)"
				style="width: 60px; padding: 8px"
			>
			<button class="remove" onclick="removeItem(${index})">
				Eliminar
			</button>
		</div>
	`).join('');

	const summaryHtml = `
		<div class="summary">
			<p>Subtotal: <strong>${money(subtotal)}</strong></p>
			<p>Envío: <strong>${shipping ? money(shipping) : 'GRATIS'}</strong></p>
			<h2>Total: ${money(total)}</h2>
			<button class="checkout" onclick="checkout()">
				💳 Realizar compra
			</button>
		</div>
	`;

	cartElement.innerHTML = itemsHtml + summaryHtml;
}

function qty(index, amount) {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');

	cart[index].cantidad = Math.max(1, Number(amount));
	localStorage.setItem('techzone_cart', JSON.stringify(cart));
	render();
}

function removeItem(index) {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');

	cart.splice(index, 1);
	localStorage.setItem('techzone_cart', JSON.stringify(cart));
	render();
}

function checkout() {
	const cart = JSON.parse(localStorage.getItem('techzone_cart') || '[]');

	if (!cart.length) {
		return alert('El carrito está vacío');
	}

	alert('✅ Compra simulada correctamente. ¡Gracias por comprar en TechZone!');
	localStorage.removeItem('techzone_cart');
	location.href = 'index.html';
}

render();
