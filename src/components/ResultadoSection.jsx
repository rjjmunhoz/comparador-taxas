import FiltroTipo from "./FiltroTipo";
import ResultCard from "./ResultCard";
import { passaFiltroTipo } from "../lib/calculo";

export default function ResultadoSection({ resultados, filtro, onFiltroChange }) {
  const visiveis = resultados.filter((item) =>
    passaFiltroTipo(item.tipo, filtro.maquininha, filtro.gateway)
  );

  const menorCusto = visiveis.find((item) => item.completo)?.totalMensal;

  return (
    <section className="card" id="resultado-section">
      <div className="resultado-header">
        <h2>Resultado</h2>
        <FiltroTipo
          idPrefix="filtro"
          value={filtro}
          onChange={onFiltroChange}
          ariaLabel="Filtrar por tipo"
        />
      </div>
      <div id="resultado">
        {resultados.length > 0 && visiveis.length === 0 ? (
          <p className="empty-state">
            Nenhum provedor encontrado para os filtros selecionados.
          </p>
        ) : visiveis.length > 0 ? (
          <div className="provider-grid">
            {visiveis.map((item) => (
              <ResultCard
                item={item}
                melhor={item.completo && item.totalMensal === menorCusto}
                key={item.nome}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
