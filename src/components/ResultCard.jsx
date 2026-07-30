import { moneyFormatter } from "../lib/calculo";

export default function ResultCard({ item, melhor }) {
  const tags = item.tipo.map((t) => (
    <span className="tag" key={t}>
      {t}
    </span>
  ));

  if (!item.completo) {
    return (
      <article className="provider-card incompleto">
        <div className="provider-card-header">
          <h3>{item.nome}</h3>
          <div className="tags">{tags}</div>
        </div>
        <p className="empty-state">
          Dados insuficientes para calcular: {item.camposFaltantes.join(", ")}
          .
        </p>
      </article>
    );
  }

  return (
    <article className={`provider-card ${melhor ? "melhor" : ""}`}>
      <div className="provider-card-header">
        <h3>
          {item.nome} {melhor ? <span className="badge">Melhor custo</span> : null}
        </h3>
        <div className="tags">{tags}</div>
      </div>
      <p className="total-mensal">
        {moneyFormatter.format(item.totalMensal)}
        <span>/mês</span>
      </p>
      <dl className="provider-details">
        <div>
          <dt>Custo transacional</dt>
          <dd>{moneyFormatter.format(item.custoTransacional)}</dd>
        </div>
        <div>
          <dt>Mensalidade</dt>
          <dd>{moneyFormatter.format(item.mensalidade)}</dd>
        </div>
        <div>
          <dt>Adesão/12</dt>
          <dd>{moneyFormatter.format(item.adesaoMensalizada)}</dd>
        </div>
        <div>
          <dt>Custo por venda</dt>
          <dd>{moneyFormatter.format(item.custoPorVenda)}</dd>
        </div>
        <div>
          <dt>Antecipação automática</dt>
          <dd>{item.antecipacaoAutomatica ? "Sim" : "Não"}</dd>
        </div>
      </dl>
      {item.fonte ? (
        <a className="fonte" href={item.fonte} target="_blank" rel="noopener">
          Fonte oficial (atualizado em {item.atualizadoEm})
        </a>
      ) : null}
    </article>
  );
}
