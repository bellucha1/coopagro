const produtos = [
  { nome: "Sementes de Soja", preco: 120, img: "https://images.unsplash.com/photo-1581093588401-22d7a5e8d6a0" },
  { nome: "Fertilizante Orgânico", preco: 80, img: "https://images.unsplash.com/photo-1615485291535-0f3f5d5ecfae" },
  { nome: "Adubo Nitrogenado", preco: 95, img: "https://images.unsplash.com/photo-1581092580496-e0d37f1a1df4" },
  { nome: "Herbicida Natural", preco: 60, img: "https://images.unsplash.com/photo-1623069759568-7cfd51c8e8b1" },
];

const catalogoDiv = document.getElementById("catalogo-lista");
const carrinhoDiv = document.getElementById("carrinho-lista");
let carrinho = [];

// Renderizar produtos
produtos.forEach(p => {
  const card = document.createElement("div");
  card.className = "produto";
  card.innerHTML = `
    <img src="${p.img}" alt="${p.nome}">
    <h3>${p.nome}</h3>
    <p>Preço: R$ ${p.preco}</p>
    <button onclick="adicionarCarrinho('${p.nome}', ${p.preco})">Adicionar</button>
  `;
  catalogoDiv.appendChild(card);
});

function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  carrinhoDiv.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    total += item.preco;
    carrinhoDiv.innerHTML += `
      <div class="item-carrinho">
        <span>${item.nome}</span>
        <strong>R$ ${item.preco}</strong>
        <button onclick="removerItem(${i})">❌</button>
      </div>`;
  });
  document.getElementById("total").innerText = "Total: R$ " + total;
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function mostrar(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Modo escuro
const modoBtn = document.getElementById("modo-btn");
modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  modoBtn.textContent = document.body.classList.contains("dark") ? "☀️ Modo Claro" : "🌙 Modo Escuro";
});

// Gráfico de vendas
const ctx = document.getElementById("graficoVendas");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
    datasets: [{
      label: "Vendas (R$)",
      data: [300, 450, 600, 400, 700],
      backgroundColor: "#66bb6a"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});
