import { CATEGORIAS, formatarTaxa, moneyFormatter } from "../lib/calculo";

export default function ProviderCatalogCard({ provedor }) {
  const tipo = Array.isArray(provedor.tipo) ? provedor.tipo : [];
  const taxas = provedor.taxas || {};

  return (
    <article className="provider-card">
      <div className="provider-card-header">
        <h3>{provedor.nome || "Sem nome"}</h3>
        <div className="tags">
          {tipo.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <dl className="provider-details">
        {CATEGORIAS.map((cat) => (
          <div key={cat.chave}>
            <dt>{cat.rotulo}</dt>
            <dd>{formatarTaxa(taxas[cat.taxaKey])}</dd>
          </div>
        ))}
        <div>
          <dt>Mensalidade</dt>
          <dd>{moneyFormatter.format(provedor.mensalidade || 0)}</dd>
        </div>
        <div>
          <dt>Taxa de adesão</dt>
          <dd>{moneyFormatter.format(provedor.taxa_adesao || 0)}</dd>
        </div>
        <div>
          <dt>Antecipação automática</dt>
          <dd>{provedor.antecipacao_automatica ? "Sim" : "Não"}</dd>
        </div>
      </dl>
      {provedor.fonte ? (
        <a
          className="fonte"
          href={provedor.fonte}
          target="_blank"
          rel="noopener"
        >
          Fonte oficial (atualizado em {provedor.atualizado_em || "?"})
        </a>
      ) : null}
    </article>
  );
}
