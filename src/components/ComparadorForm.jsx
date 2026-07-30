import { CATEGORIAS, numberFormatter, somaPercentuais, percentuaisValidos } from "../lib/calculo";

const ROTULOS_FORM = {
  debito: "Débito",
  credito1x: "Crédito à vista (1x)",
  credito2x6x: "Crédito parcelado (2x-6x)",
  credito7x12x: "Crédito parcelado (7x-12x)",
  pix: "Pix",
  boleto: "Boleto",
};

export default function ComparadorForm({
  volumeMensal,
  ticketMedio,
  percentuais,
  onChangeVolume,
  onChangeTicket,
  onChangePercentual,
  onNormalizar,
  onSubmit,
  erro,
}) {
  const soma = somaPercentuais(percentuais);
  const valido = percentuaisValidos(percentuais);

  return (
    <section className="card">
      <h2>Perfil de vendas</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid">
          <label>
            Volume mensal (R$)
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 50000"
              required
              value={volumeMensal}
              onChange={(event) => onChangeVolume(event.target.value)}
            />
          </label>

          <label>
            Ticket médio (R$)
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ex.: 120"
              required
              value={ticketMedio}
              onChange={(event) => onChangeTicket(event.target.value)}
            />
          </label>
        </div>

        <h3>Distribuição das vendas (%)</h3>

        <div className="grid">
          {CATEGORIAS.map((cat) => (
            <label key={cat.chave}>
              {ROTULOS_FORM[cat.chave]}
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0"
                required
                value={percentuais[cat.chave]}
                onChange={(event) =>
                  onChangePercentual(cat.chave, event.target.value)
                }
              />
            </label>
          ))}
        </div>

        <div className="soma-linha">
          <p className={`hint ${valido ? "valido" : ""}`}>
            Soma atual: {numberFormatter.format(soma)}% (precisa ser 100%)
          </p>
          <button type="button" className="btn-secundario" onClick={onNormalizar}>
            Ajustar para 100%
          </button>
        </div>
        <p className="error" role="alert" aria-live="polite">
          {erro}
        </p>

        <button type="submit">Comparar taxas</button>
      </form>
    </section>
  );
}
