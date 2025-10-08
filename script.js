// Produtos iniciais
const produtos = [
  { nome: "Mel Orgânico", preco: 25, img: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
  { nome: "Leite de Cabra", preco: 12, img: "https://cdn-icons-png.flaticon.com/512/432/432693.png" },
  { nome: "Queijo Colonial", preco: 30, img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { nome: "Geleia Artesanal", preco: 15, img: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
];

let carrinho = [];
let vendas = [];

// Mostrar seções
function mostrarSecao(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Renderizar catálogo
const catalogo = document.getElementById("catalogo");
produtos.forEach((p, i) => {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = `
    <img src="${p.img}" alt="${p.nome}">
    <h3>${p.nome}</h3>
    <p>R$ ${p.preco}</p>
    <button onclick="adicionarCarrinho(${i})">Adicionar ao carrinho</button>`;
  catalogo.appendChild(div);
});

// Atualizar carrinho
function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  lista.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    total += item.preco;
    lista.innerHTML += `
      <div class="item-carrinho">
        <span>${item.nome} - R$ ${item.preco}</span>
        <button onclick="removerItem(${i})">❌</button>
      </div>`;
  });
  document.getElementById("total").textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Adicionar/Remover
function adicionarCarrinho(i) {
  carrinho.push(produtos[i]);
  atualizarCarrinho();
}
function removerItem(i) {
  carrinho.splice(i, 1);
  atualizarCarrinho();
}

// Modal de pagamento
const modal = document.getElementById("modal");
document.getElementById("finalizar").onclick = () => {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
  modal.classList.remove("hidden");
};

function fecharModal() {
  modal.classList.add("hidden");
}

function finalizarPagamento(metodo) {
  const total = carrinho.reduce((acc, p) => acc + p.preco, 0);
  vendas.push({ valor: total, metodo });
  alert(`Compra realizada com sucesso via ${metodo}! Total: R$ ${total.toFixed(2)}`);
  carrinho = [];
  atualizarCarrinho();
  fecharModal();
  atualizarGrafico();
}

// Gráfico de vendas
const ctx = document.getElementById("graficoVendas");
const grafico = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Vendas (R$)",
      data: [],
      backgroundColor: "#2e7d32"
    }]
  },
  options: { scales: { y: { beginAtZero: true } } }
});

function atualizarGrafico() {
  const total = vendas.map(v => v.valor);
  const metodos = vendas.map(v => v.metodo);
  grafico.data.labels = metodos;
  grafico.data.datasets[0].data = total;
  grafico.update();
}

// Modo escuro
document.getElementById("modo-btn").onclick = () => {
  document.body.classList.toggle("dark");
};

