export const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CATEGORIAS = [
  { chave: "debito", taxaKey: "debito", rotulo: "Débito" },
  { chave: "credito1x", taxaKey: "credito_1x", rotulo: "Crédito 1x" },
  { chave: "credito2x6x", taxaKey: "credito_2x_6x", rotulo: "Crédito 2x-6x" },
  { chave: "credito7x12x", taxaKey: "credito_7x_12x", rotulo: "Crédito 7x-12x" },
  { chave: "pix", taxaKey: "pix", rotulo: "Pix" },
  { chave: "boleto", taxaKey: "boleto", rotulo: "Boleto" },
];

export function percentuaisIniciais() {
  return CATEGORIAS.reduce((acc, cat) => {
    acc[cat.chave] = "";
    return acc;
  }, {});
}

export function toNumber(value) {
  return Number.parseFloat(value) || 0;
}

export function somaPercentuais(percentuais) {
  return CATEGORIAS.reduce((acc, cat) => acc + toNumber(percentuais[cat.chave]), 0);
}

export function percentuaisValidos(percentuais) {
  return Math.abs(somaPercentuais(percentuais) - 100) < 0.01;
}

export function normalizarPercentuais(percentuais) {
  const soma = somaPercentuais(percentuais);
  if (soma <= 0) {
    return null;
  }

  const fator = 100 / soma;
  let somaParcial = 0;
  const normalizado = {};

  CATEGORIAS.forEach((cat, indice) => {
    const ultimo = indice === CATEGORIAS.length - 1;
    const valor = ultimo
      ? Math.round((100 - somaParcial) * 100) / 100
      : Math.round(toNumber(percentuais[cat.chave]) * fator * 100) / 100;

    somaParcial += valor;
    normalizado[cat.chave] = valor;
  });

  return normalizado;
}

export function calcularCustoMensal(volumeMensal, ticketMedio, percentuais, provedor) {
  const taxas = provedor.taxas || {};
  const camposFaltantes = [];
  let custoTransacional = 0;

  CATEGORIAS.forEach((cat) => {
    const percentual = toNumber(percentuais[cat.chave]);
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

export function passaFiltroTipo(tipo, querMaquininha, querGateway) {
  if (!querMaquininha && !querGateway) {
    return false;
  }

  const ehMaquininha = tipo.includes("maquininha");
  const ehGateway = tipo.includes("gateway");

  return (querMaquininha && ehMaquininha) || (querGateway && ehGateway);
}

export function formatarTaxa(valor) {
  return valor === null || valor === undefined
    ? "—"
    : `${numberFormatter.format(valor)}%`;
}
