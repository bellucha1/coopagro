// ----- Utilities -----
const currency = (v)=> Number(v).toFixed(2).replace('.',',');
const now = ()=> new Date().toISOString();

// ----- Sample product list (30 items) -----
const PRODUCTS = [
  {id:1,name:'Adubo NPK 20kg',price:135.50},
  {id:2,name:'Semente de Milho 10kg',price:220.00},
  {id:3,name:'Semente de Soja 10kg',price:198.20},
  {id:4,name:'Inseticida X-200 1L',price:45.00},
  {id:5,name:'Fertilizante Foliar 2L',price:72.00},
  {id:6,name:'Calcário 20kg',price:90.50},
  {id:7,name:'Herbicida Agro 1L',price:62.30},
  {id:8,name:'Ração Bovinos 25kg',price:162.00},
  {id:9,name:'Saco de Silagem 1un',price:18.00},
  {id:10,name:'Pneu Trator 18"',price:780.00},
  {id:11,name:'Lubrificante 5L',price:58.00},
  {id:12,name:'Luvas Térmicas (par)',price:18.50},
  {id:13,name:'Mangueira 10m',price:55.00},
  {id:14,name:'Colete de Proteção',price:120.00},
  {id:15,name:'Bomba de Irrigação',price:1250.00},
  {id:16,name:'Arado Simples',price:3200.00},
  {id:17,name:'Ferramenta Manual (kit)',price:98.00},
  {id:18,name:'Sementes de Feijão 5kg',price:84.00},
  {id:19,name:'Rolo Compactador',price:560.00},
  {id:20,name:'Baldes 20L (un)',price:12.50},
  {id:21,name:'Fertilizante Orgânico 10kg',price:110.00},
  {id:22,name:'Estopa para Oficina',price:6.00},
  {id:23,name:'Correia Trator',price:220.00},
  {id:24,name:'Válvula 1"',price:34.00},
  {id:25,name:'Caixa de Ferramentas',price:240.00},
  {id:26,name:'Ração Aves 20kg',price:98.00},
  {id:27,name:'Sementes Pastagem 5kg',price:76.50},
  {id:28,name:'Fita Métrica 5m',price:14.80},
  {id:29,name:'Viveiro de Mudas (kit)',price:460.00},
  {id:30,name:'Kit Irrigação Gotejo',price:330.00}
];

// ----- Persistence keys -----
const KEY_CART = 'coop_cart_v1';
const KEY_USER = 'coop_user_v1';
const KEY_SALES = 'coop_sales_v1';

// ----- App state -----
let cart = JSON.parse(localStorage.getItem(KEY_CART) || '[]');
let user = JSON.parse(localStorage.getItem(KEY_USER) || 'null');
let sales = JSON.parse(localStorage.getItem(KEY_SALES) || '[]');

// ----- Render functions -----
function renderProducts(){
  const wrap = document.getElementById('products'); wrap.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <div class="thumb">🌾</div>
      <h3>${p.name}</h3>
      <div class="price">R$ ${currency(p.price)}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input type="number" min="1" value="1" data-id="${p.id}" style="width:68px;padding:6px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)" />
        <button data-id="${p.id}">Adicionar</button>
      </div>`;
    wrap.appendChild(el);
  });
  document.querySelectorAll('.card button').forEach(b=>b.addEventListener('click',addFromCard));
}

function addFromCard(e){
  const id = Number(e.currentTarget.dataset.id);
  const qtyEl = e.currentTarget.previousElementSibling;
  const qty = Number(qtyEl.value) || 1;
  addToCart(id, qty);
}

function addToCart(id, qty=1){
  const prod = PRODUCTS.find(p=>p.id===id); if(!prod) return;
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += qty; else cart.push({id:id, qty:qty, name:prod.name, price:prod.price});
  syncCart(); renderCart(); toast('Adicionado ao carrinho')
}

function renderCart(){
  const list = document.getElementById('cart-list');
  if(cart.length===0){ list.innerHTML = '<small>Seu carrinho está vazio.</small>'; document.getElementById('cart-count').textContent='0'; document.getElementById('cart-total').textContent='0.00'; return}
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
  let html=''; cart.forEach(it=>{
    html+=`<div class="cart-item"><div><strong>${it.name}</strong><div style="font-size:13px">${it.qty} x R$ ${currency(it.price)}</div></div><div style="text-align:right"><div>R$ ${currency(it.qty*it.price)}</div><div style="margin-top:6px"><button onclick="changeQty(${it.id},1)">+</button><button onclick="changeQty(${it.id},-1)">-</button><button onclick="removeItem(${it.id})">Rem</button></div></div></div>`
  });
  list.innerHTML = html;
  document.getElementById('cart-total').textContent = currency(cart.reduce((s,i)=>s+i.qty*i.price,0));
}

function changeQty(id,delta){ const item = cart.find(i=>i.id===id); if(!item) return; item.qty += delta; if(item.qty<=0) cart = cart.filter(i=>i.id!==id); syncCart(); renderCart(); }
function removeItem(id){ cart = cart.filter(i=>i.id!==id); syncCart(); renderCart(); }
function clearCart(){ cart=[]; syncCart(); renderCart(); }
function syncCart(){ localStorage.setItem(KEY_CART, JSON.stringify(cart)); }

// ----- Checkout flow -----
document.getElementById('btn-checkout').addEventListener('click', ()=>{
  if(cart.length===0) return alert('Carrinho vazio.');
  if(!user){ alert('Faça o cadastro antes de finalizar.'); document.getElementById('open-cadastro').click(); return }
  const pm = prompt('Forma de pagamento: digite 1-Cartão,2-PIX,3-Boleto,4-Dinheiro (ex:1)');
  const map = { '1':'Cartão','2':'PIX','3':'Boleto','4':'Dinheiro' };
  const method = map[pm]||'Outro';
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
  const confirmMsg = `Confirmar venda para ${user.nome} — total R$ ${currency(total)} — pagamento: ${method}? (OK para confirmar)`;
  if(!confirm(confirmMsg)) return;
  const sale = { id: 'S' + (sales.length+1), user: user, items: cart.slice(), total: total, payment: method, date: now() };
  sales.push(sale); localStorage.setItem(KEY_SALES, JSON.stringify(sales));
  clearCart(); alert('Venda registrada!'); renderReport();
});

document.getElementById('btn-clear').addEventListener('click', ()=>{ if
