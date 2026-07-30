import FiltroTipo from "./FiltroTipo";
import ProviderCatalogCard from "./ProviderCatalogCard";
import { passaFiltroTipo } from "../lib/calculo";

export default function CatalogoSection({ provedores, filtro, onFiltroChange }) {
  const visiveis = provedores.filter((provedor) =>
    passaFiltroTipo(
      Array.isArray(provedor.tipo) ? provedor.tipo : [],
      filtro.maquininha,
      filtro.gateway
    )
  );

  return (
    <section className="card" id="catalogo-section">
      <div className="resultado-header">
        <h2>Todos os provedores</h2>
        <FiltroTipo
          idPrefix="catalogoFiltro"
          value={filtro}
          onChange={onFiltroChange}
          ariaLabel="Filtrar catálogo por tipo"
        />
      </div>
      <p className="hint">
        Taxas brutas divulgadas pelos provedores. Preencha o formulário
        abaixo para calcular o custo mensal estimado com o seu perfil de
        vendas.
      </p>
      <div id="catalogo">
        {provedores.length === 0 ? (
          <p className="empty-state">
            Nenhum provedor cadastrado ainda em data.json.
          </p>
        ) : visiveis.length === 0 ? (
          <p className="empty-state">
            Nenhum provedor encontrado para os filtros selecionados.
          </p>
        ) : (
          <div className="provider-grid">
            {visiveis.map((provedor) => (
              <ProviderCatalogCard provedor={provedor} key={provedor.nome} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
