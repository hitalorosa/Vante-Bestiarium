/* ============================================================
   VANTE BESTIARIUM — main.js
   ============================================================ */

let todosMonstros = [];
let tipoAtivo = 'Todos';
let raridadeAtiva = 'Todos';
let buscaAtual = '';
let ultimoElementoFocado = null;

/* ============================================================
   CARREGAMENTO DE DADOS
   ============================================================ */
async function inicializar() {
  try {
    const resposta = await fetch('data/monsters.json');
    const dados = await resposta.json();
    todosMonstros = dados.monstros;
    renderizarCards(todosMonstros);
    inicializarFiltros();
    inicializarBusca();
    inicializarModal();
  } catch (err) {
    console.error('Erro ao carregar monsters.json:', err);
    document.getElementById('estado-vazio').hidden = false;
  }
}

/* ============================================================
   RENDERIZAÇÃO DE CARDS
   ============================================================ */
function renderizarCards(lista) {
  const grade = document.getElementById('grade');
  const estadoVazio = document.getElementById('estado-vazio');
  const contagem = document.getElementById('contagem-resultados');

  grade.innerHTML = '';

  if (lista.length === 0) {
    estadoVazio.hidden = false;
    contagem.textContent = 'Nenhum monstro encontrado.';
    return;
  }

  estadoVazio.hidden = true;
  contagem.textContent = `Exibindo ${lista.length} de ${todosMonstros.length} monstro${lista.length !== 1 ? 's' : ''}`;

  lista.forEach((monstro, indice) => {
    const wrapper = criarCardHTML(monstro, indice);
    grade.appendChild(wrapper);
  });

  observarCards();
}

function criarCardHTML(monstro, indice) {
  const wrapper = document.createElement('div');
  wrapper.className = `card-wrapper raridade-${slugRaridade(monstro.raridade)}`;
  wrapper.setAttribute('role', 'listitem');
  wrapper.style.transitionDelay = `${indice * 60}ms`;

  const crTexto = formatarCR(monstro.cr);
  const modStr = (n) => {
    const mod = Math.floor((n - 10) / 2);
    return (mod >= 0 ? '+' : '') + mod;
  };

  wrapper.innerHTML = `
    <div class="card-container" tabindex="-1" aria-hidden="true">
      <div class="card-frente">
        <div class="card-topo">
          <span class="card-tipo">${monstro.tipo}</span>
          <span class="badge-raridade">${monstro.raridade}</span>
        </div>
        <div class="card-imagem">
          <img
            class="card-img"
            src="assets/monstros/${monstro.id}.png"
            alt="${monstro.nome}"
            loading="lazy"
            onerror="this.parentElement.style.display='none'"
          />
        </div>
        <h3 class="card-nome">${monstro.nome}</h3>
        <div class="card-separador"></div>
        <p class="card-descricao">${monstro.descricao}</p>
        <div class="card-rodape">
          <div class="badge-cr">
            <strong>${crTexto}</strong>
            <span>CR</span>
          </div>
          <button
            class="btn-detalhes"
            data-id="${monstro.id}"
            aria-label="Ver detalhes de ${monstro.nome}"
          >Ver Detalhes</button>
        </div>
      </div>
      <div class="card-verso">
        <div class="verso-nome">${monstro.nome}</div>
        <div class="verso-stats">
          <div class="verso-stat"><span class="verso-stat__label">FOR</span><span class="verso-stat__valor">${monstro.stats.for}</span></div>
          <div class="verso-stat"><span class="verso-stat__label">DES</span><span class="verso-stat__valor">${monstro.stats.des}</span></div>
          <div class="verso-stat"><span class="verso-stat__label">CON</span><span class="verso-stat__valor">${monstro.stats.con}</span></div>
          <div class="verso-stat"><span class="verso-stat__label">INT</span><span class="verso-stat__valor">${monstro.stats.int}</span></div>
          <div class="verso-stat"><span class="verso-stat__label">SAB</span><span class="verso-stat__valor">${monstro.stats.sab}</span></div>
          <div class="verso-stat"><span class="verso-stat__label">CAR</span><span class="verso-stat__valor">${monstro.stats.car}</span></div>
        </div>
        <div class="verso-combate">
          <div class="verso-combate__item">
            <span class="verso-combate__label">PV</span>
            <span class="verso-combate__valor">${monstro.pv}</span>
          </div>
          <div class="verso-combate__item">
            <span class="verso-combate__label">CA</span>
            <span class="verso-combate__valor">${monstro.ca}</span>
          </div>
          <div class="verso-combate__item">
            <span class="verso-combate__label">CR</span>
            <span class="verso-combate__valor">${crTexto}</span>
          </div>
        </div>
        <button
          class="btn-ficha"
          data-id="${monstro.id}"
          aria-label="Abrir ficha completa de ${monstro.nome}"
        >Ficha Completa →</button>
      </div>
    </div>
    <span class="sr-only">${monstro.nome} — ${monstro.raridade} ${monstro.tipo}</span>
  `;

  wrapper.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      abrirModal(monstro.id);
    });
  });

  return wrapper;
}

/* ============================================================
   INTERSECTION OBSERVER — ENTRADA DOS CARDS
   ============================================================ */
function observarCards() {
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.card-wrapper').forEach(card => {
    observer.observe(card);
  });
}

/* ============================================================
   FILTROS
   ============================================================ */
function inicializarFiltros() {
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.dataset.filtro;
      const valor = btn.dataset.valor;

      document.querySelectorAll(`.pill[data-filtro="${filtro}"]`).forEach(p => {
        p.classList.remove('pill--ativo');
        p.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('pill--ativo');
      btn.setAttribute('aria-pressed', 'true');

      if (filtro === 'tipo') tipoAtivo = valor;
      if (filtro === 'raridade') raridadeAtiva = valor;

      aplicarFiltros();
    });
  });
}

function aplicarFiltros() {
  const resultado = todosMonstros.filter(m => {
    const passaTipo = tipoAtivo === 'Todos' || m.tipo === tipoAtivo;
    const passaRaridade = raridadeAtiva === 'Todos' || m.raridade === raridadeAtiva;
    const termoBusca = buscaAtual.toLowerCase().trim();
    const passaBusca = !termoBusca ||
      m.nome.toLowerCase().includes(termoBusca) ||
      m.descricao.toLowerCase().includes(termoBusca) ||
      m.tipo.toLowerCase().includes(termoBusca);

    return passaTipo && passaRaridade && passaBusca;
  });

  renderizarCards(resultado);
}

/* ============================================================
   BUSCA
   ============================================================ */
function inicializarBusca() {
  const campo = document.getElementById('campo-busca');
  let timer = null;

  campo.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      buscaAtual = campo.value;
      aplicarFiltros();
    }, 280);
  });
}

/* ============================================================
   MODAL
   ============================================================ */
function inicializarModal() {
  document.getElementById('modal-fechar').addEventListener('click', fecharModal);
  document.getElementById('modal-backdrop').addEventListener('click', fecharModal);

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modal');
    if (!modal.hidden && e.key === 'Escape') fecharModal();
    if (!modal.hidden && e.key === 'Tab') capturarFoco(e);
  });
}

function abrirModal(id) {
  const monstro = todosMonstros.find(m => m.id === id);
  if (!monstro) return;

  ultimoElementoFocado = document.activeElement;

  preencherModal(monstro);

  const modal = document.getElementById('modal');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('modal-fechar').focus();
  });
}

function fecharModal() {
  const modal = document.getElementById('modal');
  modal.hidden = true;
  document.body.style.overflow = '';
  if (ultimoElementoFocado) ultimoElementoFocado.focus();
}

function preencherModal(monstro) {
  document.getElementById('modal-nome').textContent = monstro.nome;
  document.getElementById('modal-tipo').textContent = monstro.tipo;
  document.getElementById('modal-lore').textContent = monstro.lore;
  document.getElementById('modal-habitat').textContent = `Habitat: ${monstro.habitat}`;

  const badgeRaridade = document.getElementById('modal-raridade');
  badgeRaridade.textContent = monstro.raridade;
  badgeRaridade.className = `modal__badge-raridade raridade-${slugRaridade(monstro.raridade)}`;

  const statsGrid = document.getElementById('modal-stats');
  const nomesStats = [
    { chave: 'for', nome: 'FOR' },
    { chave: 'des', nome: 'DES' },
    { chave: 'con', nome: 'CON' },
    { chave: 'int', nome: 'INT' },
    { chave: 'sab', nome: 'SAB' },
    { chave: 'car', nome: 'CAR' },
  ];

  statsGrid.innerHTML = nomesStats.map(({ chave, nome }) => {
    const valor = monstro.stats[chave];
    const mod = Math.floor((valor - 10) / 2);
    const modStr = (mod >= 0 ? '+' : '') + mod;
    return `
      <div class="modal__stat">
        <span class="modal__stat-label">${nome}</span>
        <span class="modal__stat-valor">${valor}</span>
        <span class="modal__stat-mod">${modStr}</span>
      </div>
    `;
  }).join('');

  const combate = document.getElementById('modal-combate');
  combate.innerHTML = `
    <div class="modal__combate-item">
      <span class="modal__combate-label">Pontos de Vida</span>
      <span class="modal__combate-valor">${monstro.pv}</span>
    </div>
    <div class="modal__combate-item">
      <span class="modal__combate-label">Classe de Armadura</span>
      <span class="modal__combate-valor">${monstro.ca}</span>
    </div>
    <div class="modal__combate-item">
      <span class="modal__combate-label">Deslocamento</span>
      <span class="modal__combate-valor">${monstro.deslocamento}</span>
    </div>
    <div class="modal__combate-item">
      <span class="modal__combate-label">Nível de Desafio</span>
      <span class="modal__combate-valor">${formatarCR(monstro.cr)}</span>
    </div>
  `;

  const listaHabilidades = document.getElementById('modal-habilidades');
  listaHabilidades.innerHTML = monstro.habilidades.map(h => `
    <li class="habilidade">
      <p class="habilidade__nome">${h.nome}</p>
      <p class="habilidade__desc">${h.descricao}</p>
    </li>
  `).join('');
}

function capturarFoco(e) {
  const modal = document.getElementById('modal');
  const focaveis = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    }
  } else {
    if (document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  }
}


/* ============================================================
   UTILITÁRIOS
   ============================================================ */
function slugRaridade(raridade) {
  const mapa = {
    'Comum': 'comum',
    'Incomum': 'incomum',
    'Raro': 'raro',
    'Épico': 'epico',
    'Lendário': 'lendario',
  };
  return mapa[raridade] || 'comum';
}

function formatarCR(cr) {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25)  return '1/4';
  if (cr === 0.5)   return '1/2';
  return String(cr);
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', inicializar);
