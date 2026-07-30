export default function FiltroTipo({ idPrefix, value, onChange, ariaLabel }) {
  return (
    <div className="filtro-tipo" role="group" aria-label={ariaLabel}>
      <label className="chip">
        <input
          type="checkbox"
          id={`${idPrefix}Maquininha`}
          checked={value.maquininha}
          onChange={(event) =>
            onChange({ ...value, maquininha: event.target.checked })
          }
        />
        Maquininha
      </label>
      <label className="chip">
        <input
          type="checkbox"
          id={`${idPrefix}Gateway`}
          checked={value.gateway}
          onChange={(event) =>
            onChange({ ...value, gateway: event.target.checked })
          }
        />
        Gateway
      </label>
    </div>
  );
}
