// Demo web app logic: catalog, cart, orders, reports using localStorage

/* ---------------------------
Demo data: Produtos (mock)
-------------------------
-*/
const PRODUCTS = [
{ id: '1', nome: 'Semente de milho', preco: 150, img: 'https://via.placeholder.com/120?text=Milho&#39; },
{ id: '2', nome: 'Adubo NPK 20-05-20', preco: 120, img: 'https://via.placeholder.com/120?text=NPK&#39; },
{ id: '3', nome: 'Defensivo agrícola', preco: 90, img: 'https://via.placeholder.com/120?text=Defensivo&#39; },
{ id: '4', nome: 'Semente de soja', preco: 140, img: 'https://via.placeholder.com/120?text=Soja&#39; },
];
/* ---------------------------
Storage helpers
-------------------------
-*/
const STORAGE = {
getCart(){ return JSON.parse(localStorage.getItem('coop_cart') || '[]'); },
setCart(c){ localStorage.setItem('coop_cart', JSON.stringify(c)); },
getUser(){ return JSON.parse(localStorage.getItem('coop_user') || 'null'); },
setUser(u){ localStorage.setItem('coop_user', JSON.stringify(u)); },
getOrders(){ return JSON.parse(localStorage.getItem('coop_orders') || '[]'); },
setOrders(o){ localStorage.setItem('coop_orders', JSON.stringify(o)); }
};
/* ---------------------------
DOM references
-------------------------
-*/
const views = {
login: document.getElementById('view-login'),
home: document.getElementById('view-home'),
catalog: document.getElementById('view-catalog'),
cart: document.getElementById('view-cart'),
orders: document.getElementById('view-orders'),
reports: document.getElementById('view-reports'),
};
const navBtns = document.querySelectorAll('.nav-btn');
const actionCards = document.querySelectorAll('.action');
const loginForm = document.getElementById('login-form');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const usernameDisplay = document.getElementById('username-display');
const userArea = document.getElementById('user-area');
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const cartListEl = document.getElementById('cart-list');
const cartTotalEl = document.getElementById('cart-total');
const btnClear = document.getElementById('btn-clear');
const btnCheckout = document.getElementById('btn-checkout');
const ordersListEl = document.getElementById('orders-list');
const reportTotalEl = document.getElementById('report-total');
const reportCountEl = document.getElementById('report-count');
const chartCanvas = document.getElementById('chart');
/* ---------------------------
Navigation & Auth
-------------------------
-*/
function showView(name){
Object.values(views).forEach(v => v.hidden = true);
const target = views[name];
if(target) target.hidden = false;
window.scrollTo({top:0, behavior:'smooth'});
}
navBtns.forEach(b => b.addEventListener('click', ()=> {
const view = b.dataset.view;
navigateTo(view);
}));
actionCards.forEach(c => c.addEventListener('click', ()=> {
const view = c.dataset.view;
navigateTo(view);
}));

function navigateTo(view){
const user = STORAGE.getUser();
if(!user && view !== 'login'){
showView('login');
return;
}
showView(view);
if(view === 'catalog') renderProducts();
if(view === 'cart') renderCart();
if(view === 'orders') renderOrders();
if(view === 'reports') renderReports();
updateCartCount();
}

/* Auth */
function refreshAuthUI(){
const user = STORAGE.getUser();
if(user){
document.getElementById('btn-login').style.display = 'none';
btnLogout.style.display = 'inline-block';
usernameDisplay.style.display = 'inline-block';
usernameDisplay.textContent = user.username;
}else{
document.getElementById('btn-login').style.display = 'inline-block';
btnLogout.style.display = 'none';
usernameDisplay.style.display = 'none';
}
}
btnLogin.addEventListener('click', ()=> showView('login'));
btnLogout.addEventListener('click', ()=> {
STORAGE.setUser(null);
refreshAuthUI();
showView('login');
});

/* Handle login form */
loginForm.addEventListener('submit', (ev)=>{
ev.preventDefault();
const user = document.getElementById('input-user').value.trim();
const pass = document.getElementById('input-pass').value.trim();
if(!user || !pass){ alert('Preencha usuário e senha'); return; }
STORAGE.setUser({ username: user });
refreshAuthUI();
navigateTo('home');
loginForm.reset();
});

/* ---------------------------
Products / Catalog
-------------------------
-*/
function renderProducts(filter = ''){
productsEl.innerHTML = '';
const list = PRODUCTS.filter(p => p.nome.toLowerCase().includes(filter.toLowerCase()));
list.forEach(p => {
const div = document.createElement('div');
div.className = 'product';
div.innerHTML = `
<img src="${p.img}" alt="${p.nome}" />
<div class="product-info">
<div><strong>${p.nome}</strong></div>
<div class="price">R$${p.preco.toFixed(2)}</div>
</div>
<button class="btn add-btn">Adicionar</button>
`;
div.querySelector('.add-btn').addEventListener('click', ()=> addToCart(p.id));
productsEl.appendChild(div);
});
}
searchInput.addEventListener('input', ()=> renderProducts(searchInput.value));
/* ---------------------------
Cart functions
-------------------------
-*/
function getCart(){ return STORAGE.getCart(); }
function setCart(c){ STORAGE.setCart(c); updateCartCount(); }
function addToCart(productId){
const p = PRODUCTS.find(x=>x.id===productId);
if(!p) return;
const cart = getCart();
const found = cart.find(i => i.id === p.id);
if(found) found.qty += 1;
else cart.push({ id: p.id, nome: p.nome, preco: p.preco, qty: 1 });
setCart(cart);
if(!views.catalog.hidden) renderProducts(searchInput.value);
updateCartCount();
}
function removeFromCart(productId){
let cart = getCart();
cart = cart.filter(i => i.id !== productId);
setCart(cart);
}
function clearCart(){ setCart([]); renderCart(); }
/* Render cart */
function renderCart(){
const cart = getCart();
cartListEl.innerHTML = '';
if(cart.length === 0){
cartListEl.innerHTML = '<p>O carrinho está vazio.</p>';
cartTotalEl.textContent = 'R$0';
return;
}
const ul = document.createElement('div');
cart.forEach(item => {
const itemEl = document.createElement('div');
itemEl.className = 'cart-item';
itemEl.innerHTML = `
<div><strong>${item.nome}</strong> (x${item.qty})</div>
<div>R$${(item.preco * item.qty).toFixed(2)} <button class="link-btn rem">Remover</button></div>
`;
itemEl.querySelector('.rem').addEventListener('click', ()=> {
if(confirm('Remover item do carrinho?')){
removeFromCart(item.id);
renderCart();
}
});
ul.appendChild(itemEl);
});
cartListEl.appendChild(ul);
const total = cart.reduce((s,i)=>s + i.preco * i.qty, 0);
cartTotalEl.textContent = `R$${total.toFixed(2)}`;
}

/* Cart count in nav */
function updateCartCount(){
const cart = getCart();
const qty = cart.reduce((s,i)=>s+i.qty,0);
cartCountEl.textContent = qty;
}

/* Clear & Checkout */
btnClear.addEventListener('click', ()=> {
if(confirm('Limpar carrinho?')){ clearCart(); }
});
btnCheckout.addEventListener('click', ()=> {
const cart = getCart();
if(cart.length === 0){ alert('Carrinho vazio'); return; }
const total = cart.reduce((s,i)=>s + i.preco * i.qty, 0);
// create order
const order = {
id: Date.now().toString(),
items: cart,
total,
date: new Date().toISOString(),
status: 'Pendente'
};
const orders = STORAGE.getOrders();
orders.unshift(order);
STORAGE.setOrders(orders);
clearCart();
alert(`Pedido gerado (ID: ${order.id}) — Total R$${order.total.toFixed(2)}`);
navigateTo('orders');
});

/* ---------------------------
Orders
-------------------------
-*/
function renderOrders(){
const orders = STORAGE.getOrders();
ordersListEl.innerHTML = '';
if(orders.length === 0){ ordersListEl.innerHTML = '<p>Nenhum pedido registrado.</p>'; return; }
orders.forEach(o => {
const div = document.createElement('div');
div.className = 'order';
div.innerHTML = `
<div><strong>ID:</strong> ${o.id}</div>
<div><strong>Data:</strong> ${new Date(o.date).toLocaleString()}</div>
<div><strong>Status:</strong> ${o.status}</div>
<div><strong>Total:</strong> R$${o.total.toFixed(2)}</div>
<details style="margin-top:6px"><summary>Itens (${o.items.length})</summary>
<ul>${o.items.map(it=>`<li>${it.nome} x${it.qty} — R$${(it.preco*it.qty).toFixed(2)}</li>`).join('')}</ul>
</details>
`;
ordersListEl.appendChild(div);
});
}
/* ---------------------------
Reports (simple)
-------------------------
-*/
function renderReports(){
const orders = STORAGE.getOrders();
const totalVendas = orders.reduce((s,o)=>s + o.total, 0);
reportTotalEl.textContent = `R$${totalVendas.toFixed(2)}`;
reportCountEl.textContent = orders.length;
renderChart(orders);
}
/* Simple bar chart plotting product totals across recent orders */
function renderChart(orders){
const ctx = chartCanvas.getContext('2d');
// aggregate sales per product
const sums = {};
orders.slice(0,50).forEach(o => {
o.items.forEach(it => {
if(!sums[it.nome]) sums[it.nome] = 0;
sums[it.nome] += it.preco * it.qty;
});
});
const labels = Object.keys(sums);
const values = labels.map(l => sums[l]);

// clear
ctx.clearRect(0,0,chartCanvas.width,chartCanvas.height);
if(values.length === 0){
ctx.fillStyle = '#666';
ctx.font = '14px sans-serif';
ctx.fillText('Sem dados de vendas ainda.', 10, 24);
return;
}

// simple bar drawing
const padding = 40;
const w = chartCanvas.width;
const h = chartCanvas.height;
const max = Math.max(...values);
const barWidth = (w
padding*2) / values.length * 0.7;
const gap = ((w
padding*2) / values.length)
barWidth;
// y-axis lines
ctx.strokeStyle = '#e6efe8';
ctx.lineWidth = 1;
for(let i=0;i<=4;i++){
const y = padding + (h
padding*2) * (i/4);
ctx.beginPath();
ctx.moveTo(padding, y);
ctx.lineTo(w-padding, y);
ctx.stroke();
}
// draw bars
labels.forEach((lab, idx) => {
const val = values[idx];
const x = padding + idx * (barWidth + gap) + gap/2;
const heightPct = val / max;
const barH = (h
padding*2) * heightPct;
const y = h
padding
barH;
// bar
ctx.fillStyle = '#2E7D32';
ctx.fillRect(x, y, barWidth, barH);

// label
ctx.fillStyle = '#234d22';
ctx.font = '12px sans-serif';
const text = lab.length > 12 ? lab.slice(0,12)+'…' : lab;
ctx.fillText(text, x, h
padding + 14);
// value
ctx.fillStyle = '#333';
ctx.font = '11px sans-serif';
ctx.fillText(`R$${val.toFixed(0)}`, x, y
6);
});
}
/* ---------------------------
Init
-------------------------
-*/
function init(){
refreshAuthUI();
updateCartCount();
// show home if logged, else login
const user = STORAGE.getUser();
if(user) navigateTo('home');
else showView('login');
// pre-render products
renderProducts();
}
init();
