const form = document.getElementById("comparador-form");
const erroEl = document.getElementById("erro");
const infoEl = document.getElementById("percentual-info");
const resultadoEl = document.getElementById("resultado");
const filtroMaquininha = document.getElementById("filtroMaquininha");
const filtroGateway = document.getElementById("filtroGateway");
const catalogoEl = document.getElementById("catalogo");
const catalogoFiltroMaquininha = document.getElementById("catalogoFiltroMaquininha");
const catalogoFiltroGateway = document.getElementById("catalogoFiltroGateway");

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const CATEGORIAS = [
  { chave: "debito", taxaKey: "debito", rotulo: "Débito", inputId: "pctDebito" },
  { chave: "credito1x", taxaKey: "credito_1x", rotulo: "Crédito 1x", inputId: "pctCredito1x" },
  { chave: "credito2x6x", taxaKey: "credito_2x_6x", rotulo: "Crédito 2x-6x", inputId: "pctCredito2x6x" },
  { chave: "credito7x12x", taxaKey: "credito_7x_12x", rotulo: "Crédito 7x-12x", inputId: "pctCredito7x12x" },
  { chave: "pix", taxaKey: "pix", rotulo: "Pix", inputId: "pctPix" },
  { chave: "boleto", taxaKey: "boleto", rotulo: "Boleto", inputId: "pctBoleto" },
];

let provedores = [];
let ultimosResultados = [];

async function carregarProvedores() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar data.json");
    }

    const data = await response.json();
    provedores = Array.isArray(data.provedores) ? data.provedores : [];
  } catch (error) {
    erroEl.textContent = "Não foi possível carregar os provedores em data.json.";
  }

  renderCatalogo();
}

function toNumber(value) {
  return Number.parseFloat(value) || 0;
}

function lerPercentuais() {
  const percentuais = {};
  CATEGORIAS.forEach((cat) => {
    percentuais[cat.chave] = toNumber(document.getElementById(cat.inputId).value);
  });
  return percentuais;
}

function validarPercentuais(percentuais) {
  const soma = CATEGORIAS.reduce((acc, cat) => acc + percentuais[cat.chave], 0);

  return {
    soma,
    valido: Math.abs(soma - 100) < 0.01,
  };
}

function atualizarSomaAoVivo() {
  const validacao = validarPercentuais(lerPercentuais());
  infoEl.textContent = `Soma atual: ${numberFormatter.format(validacao.soma)}% (precisa ser 100%)`;
  infoEl.classList.toggle("valido", validacao.valido);
  return validacao;
}

function calcularCustoMensal(volumeMensal, ticketMedio, percentuais, provedor) {
  const taxas = provedor.taxas || {};
  const camposFaltantes = [];
  let custoTransacional = 0;

  CATEGORIAS.forEach((cat) => {
    const percentual = percentuais[cat.chave];
    const volumeCategoria = volumeMensal * (percentual / 100);
    const taxa = taxas[cat.taxaKey];

    if (percentual > 0 && (taxa === null || taxa === undefined)) {
      camposFaltantes.push(cat.rotulo);
      return;
    }

    custoTransacional += volumeCategoria * ((taxa || 0) / 100);
  });

  const mensalidade = provedor.mensalidade || 0;
  const adesaoMensalizada = (provedor.taxa_adesao || 0) / 12;
  const totalMensal = custoTransacional + mensalidade + adesaoMensalizada;
  const vendasEstimadas = ticketMedio > 0 ? volumeMensal / ticketMedio : 0;

  return {
    nome: provedor.nome || "Sem nome",
    tipo: Array.isArray(provedor.tipo) ? provedor.tipo : [],
    antecipacaoAutomatica: Boolean(provedor.antecipacao_automatica),
    fonte: provedor.fonte || "",
    atualizadoEm: provedor.atualizado_em || "",
    custoTransacional,
    mensalidade,
    adesaoMensalizada,
    totalMensal,
    vendasEstimadas,
    custoPorVenda: vendasEstimadas > 0 ? totalMensal / vendasEstimadas : 0,
    completo: camposFaltantes.length === 0,
    camposFaltantes,
  };
}

function passaFiltroTipo(tipo, querMaquininha, querGateway) {
  if (!querMaquininha && !querGateway) {
    return false;
  }

  const ehMaquininha = tipo.includes("maquininha");
  const ehGateway = tipo.includes("gateway");

  return (querMaquininha && ehMaquininha) || (querGateway && ehGateway);
}

function providerPassaFiltro(item) {
  return passaFiltroTipo(item.tipo, filtroMaquininha.checked, filtroGateway.checked);
}

function formatarTaxa(valor) {
  return valor === null || valor === undefined
    ? "—"
    : `${numberFormatter.format(valor)}%`;
}

function renderCatalogCard(provedor) {
  const tipo = Array.isArray(provedor.tipo) ? provedor.tipo : [];
  const taxas = provedor.taxas || {};
  const tags = tipo.map((t) => `<span class="tag">${t}</span>`).join("");

  const linhasTaxas = CATEGORIAS.map(
    (cat) => `<div><dt>${cat.rotulo}</dt><dd>${formatarTaxa(taxas[cat.taxaKey])}</dd></div>`
  ).join("");

  return `
    <article class="provider-card">
      <div class="provider-card-header">
        <h3>${provedor.nome || "Sem nome"}</h3>
        <div class="tags">${tags}</div>
      </div>
      <dl class="provider-details">
        ${linhasTaxas}
        <div><dt>Mensalidade</dt><dd>${moneyFormatter.format(provedor.mensalidade || 0)}</dd></div>
        <div><dt>Taxa de adesão</dt><dd>${moneyFormatter.format(provedor.taxa_adesao || 0)}</dd></div>
        <div><dt>Antecipação automática</dt><dd>${provedor.antecipacao_automatica ? "Sim" : "Não"}</dd></div>
      </dl>
      ${
        provedor.fonte
          ? `<a class="fonte" href="${provedor.fonte}" target="_blank" rel="noopener">Fonte oficial (atualizado em ${provedor.atualizado_em || "?"})</a>`
          : ""
      }
    </article>
  `;
}

function renderCatalogo() {
  if (provedores.length === 0) {
    catalogoEl.innerHTML =
      '<p class="empty-state">Nenhum provedor cadastrado ainda em data.json.</p>';
    return;
  }

  const visiveis = provedores.filter((provedor) =>
    passaFiltroTipo(
      Array.isArray(provedor.tipo) ? provedor.tipo : [],
      catalogoFiltroMaquininha.checked,
      catalogoFiltroGateway.checked
    )
  );

  if (visiveis.length === 0) {
    catalogoEl.innerHTML =
      '<p class="empty-state">Nenhum provedor encontrado para os filtros selecionados.</p>';
    return;
  }

  catalogoEl.innerHTML = `<div class="provider-grid">${visiveis
    .map(renderCatalogCard)
    .join("")}</div>`;
}

function renderCard(item, melhor) {
  const tags = item.tipo
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  if (!item.completo) {
    return `
      <article class="provider-card incompleto">
        <div class="provider-card-header">
          <h3>${item.nome}</h3>
          <div class="tags">${tags}</div>
        </div>
        <p class="empty-state">
          Dados insuficientes para calcular: ${item.camposFaltantes.join(", ")}.
        </p>
      </article>
    `;
  }

  return `
    <article class="provider-card ${melhor ? "melhor" : ""}">
      <div class="provider-card-header">
        <h3>${item.nome} ${melhor ? '<span class="badge">Melhor custo</span>' : ""}</h3>
        <div class="tags">${tags}</div>
      </div>
      <p class="total-mensal">${moneyFormatter.format(item.totalMensal)}<span>/mês</span></p>
      <dl class="provider-details">
        <div><dt>Custo transacional</dt><dd>${moneyFormatter.format(item.custoTransacional)}</dd></div>
        <div><dt>Mensalidade</dt><dd>${moneyFormatter.format(item.mensalidade)}</dd></div>
        <div><dt>Adesão/12</dt><dd>${moneyFormatter.format(item.adesaoMensalizada)}</dd></div>
        <div><dt>Custo por venda</dt><dd>${moneyFormatter.format(item.custoPorVenda)}</dd></div>
        <div><dt>Antecipação automática</dt><dd>${item.antecipacaoAutomatica ? "Sim" : "Não"}</dd></div>
      </dl>
      ${item.fonte ? `<a class="fonte" href="${item.fonte}" target="_blank" rel="noopener">Fonte oficial (atualizado em ${item.atualizadoEm})</a>` : ""}
    </article>
  `;
}

function renderResultado(resultados) {
  const visiveis = resultados.filter(providerPassaFiltro);

  if (visiveis.length === 0) {
    resultadoEl.innerHTML =
      '<p class="empty-state">Nenhum provedor encontrado para os filtros selecionados.</p>';
    return;
  }

  const menorCusto = visiveis.find((item) => item.completo)?.totalMensal;

  const cards = visiveis
    .map((item) => renderCard(item, item.completo && item.totalMensal === menorCusto))
    .join("");

  resultadoEl.innerHTML = `<div class="provider-grid">${cards}</div>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  erroEl.textContent = "";

  const volumeMensal = toNumber(document.getElementById("volumeMensal").value);
  const ticketMedio = toNumber(document.getElementById("ticketMedio").value);
  const percentuais = lerPercentuais();

  if (volumeMensal <= 0 || ticketMedio <= 0) {
    erroEl.textContent = "Informe volume mensal e ticket médio maiores que zero.";
    return;
  }

  const validacao = atualizarSomaAoVivo();

  if (!validacao.valido) {
    erroEl.textContent = "A soma dos percentuais deve ser exatamente 100%.";
    return;
  }

  if (provedores.length === 0) {
    resultadoEl.innerHTML =
      '<p class="empty-state">Nenhum provedor encontrado em data.json. Adicione provedores para comparar.</p>';
    return;
  }

  ultimosResultados = provedores
    .map((provedor) =>
      calcularCustoMensal(volumeMensal, ticketMedio, percentuais, provedor)
    )
    .sort((a, b) => {
      if (a.completo && !b.completo) return -1;
      if (!a.completo && b.completo) return 1;
      return a.totalMensal - b.totalMensal;
    });

  renderResultado(ultimosResultados);
});

[filtroMaquininha, filtroGateway].forEach((el) => {
  el.addEventListener("change", () => {
    if (ultimosResultados.length > 0) {
      renderResultado(ultimosResultados);
    }
  });
});

[catalogoFiltroMaquininha, catalogoFiltroGateway].forEach((el) => {
  el.addEventListener("change", renderCatalogo);
});

CATEGORIAS.forEach((cat) => {
  document.getElementById(cat.inputId).addEventListener("input", () => {
    erroEl.textContent = "";
    atualizarSomaAoVivo();
  });
});

atualizarSomaAoVivo();

carregarProvedores();
