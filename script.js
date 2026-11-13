const products = [{
		id: 1,
		name: 'Yerba tradicional',
		category: 'Yerbas',
		price: 4500,
		symbol: 'Y',
		tone: '#dce3d1'
	},
	{
		id: 2,
		name: 'Yerba compuesta',
		category: 'Yerbas',
		price: 5200,
		symbol: 'Y',
		tone: '#d5dfc9'
	},
	{
		id: 3,
		name: 'Mate artesanal',
		category: 'Mates',
		price: 18500,
		symbol: 'M',
		tone: '#e4d5c1'
	},
	{
		id: 4,
		name: 'Mate de acero',
		category: 'Mates',
		price: 22000,
		symbol: 'M',
		tone: '#d9ded8'
	},
	{
		id: 5,
		name: 'Bombilla de acero',
		category: 'Bombillas',
		price: 7800,
		symbol: 'B',
		tone: '#d8dfdc'
	},
	{
		id: 6,
		name: 'Bombilla pico de loro',
		category: 'Bombillas',
		price: 9900,
		symbol: 'B',
		tone: '#deded1'
	},
	{
		id: 7,
		name: 'Mix de hierbas',
		category: 'Hierbas',
		price: 3600,
		symbol: 'H',
		tone: '#d8e0ce'
	},
	{
		id: 8,
		name: 'Termo matero',
		category: 'Termos',
		price: 32000,
		symbol: 'T',
		tone: '#d5ddd6'
	}
];
const money = n => new Intl.NumberFormat('es-AR', {
	style: 'currency',
	currency: 'ARS',
	maximumFractionDigits: 0
}).format(n);
let cart = [];
let activeFilter = 'Todos';
const grid = document.getElementById('productGrid');

function renderProducts() {
	const shown = activeFilter === 'Todos' ? products : products.filter(p => p.category === activeFilter);
	grid.innerHTML = shown.map(p => `<article class="product-card"><div class="product-art" style="background:${p.tone}"><span class="product-symbol">${p.symbol}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3><span class="product-price">${money(p.price)} <small>· precio de ejemplo</small></span><button class="add-button" data-add="${p.id}">Agregar al carrito +</button></div></article>`).join('');
}

function renderCart() {
	const count = cart.reduce((s, i) => s + i.qty, 0);
	document.getElementById('cartCount').textContent = count;
	document.getElementById('cartTotal').textContent = money(cart.reduce((s, i) => s + i.price * i.qty, 0));
	const target = document.getElementById('cartItems');
	target.innerHTML = cart.length ? cart.map(i => `<div class="cart-line"><div><strong>${i.name}</strong><span>${money(i.price)} c/u</span><div class="quantity"><button data-change="${i.id}" data-delta="-1" aria-label="Quitar uno">−</button><span>${i.qty}</span><button data-change="${i.id}" data-delta="1" aria-label="Agregar uno">+</button></div></div><b>${money(i.price*i.qty)}</b></div>`).join('') : '<p class="empty-cart">Todavía no agregaste productos.</p>';
}

function setFilter(filter) {
	activeFilter = filter;
	document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
	renderProducts();
	document.getElementById('destacados').scrollIntoView({
		behavior: 'smooth'
	});
}
document.getElementById('filters').addEventListener('click', e => {
	const b = e.target.closest('[data-filter]');
	if (b) setFilter(b.dataset.filter)
});
document.querySelectorAll('.category-card').forEach(b => b.addEventListener('click', () => {
	setFilter(b.dataset.filter)
}));
document.getElementById('showAll').addEventListener('click', e => {
	e.preventDefault();
	setFilter('Todos')
});
grid.addEventListener('click', e => {
	const b = e.target.closest('[data-add]');
	if (!b) return;
	const p = products.find(x => x.id === Number(b.dataset.add));
	const item = cart.find(x => x.id === p.id);
	item ? item.qty++ : cart.push({
		...p,
		qty: 1
	});
	renderCart();
	b.textContent = 'Agregado ✓';
	setTimeout(() => b.textContent = 'Agregar al carrito +', 900)
});
document.getElementById('cartItems').addEventListener('click', e => {
	const b = e.target.closest('[data-change]');
	if (!b) return;
	const item = cart.find(x => x.id === Number(b.dataset.change));
	item.qty += Number(b.dataset.delta);
	if (item.qty <= 0) cart = cart.filter(x => x.id !== item.id);
	renderCart()
});
const drawer = document.getElementById('cartDrawer'),
	overlay = document.getElementById('overlay');

function openCart() {
	drawer.classList.add('open');
	overlay.classList.add('visible');
	drawer.setAttribute('aria-hidden', 'false')
}

function closeCart() {
	drawer.classList.remove('open');
	overlay.classList.remove('visible');
	drawer.setAttribute('aria-hidden', 'true')
}
document.getElementById('openCart').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('checkout').addEventListener('click', () => {
	if (!cart.length) {
		alert('Agregá al menos un producto al carrito.');
		return
	}
	const lines = cart.map(i => `• ${i.name} x${i.qty}: ${money(i.price*i.qty)}`);
	const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
	const msg = `Hola, ARUMA. Quiero consultar por este pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${money(total)}\n\n¿Me confirman disponibilidad?`;
	window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
});
document.getElementById('menuToggle').addEventListener('click', () => {
	const nav = document.getElementById('mainNav');
	const open = nav.classList.toggle('open');
	document.getElementById('menuToggle').setAttribute('aria-expanded', String(open))
});
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => {
	document.getElementById('mainNav').classList.remove('open');
	document.getElementById('menuToggle').setAttribute('aria-expanded', 'false')
}));
document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
renderCart();