import { useState } from "react";
import Hero from "./components/Hero";
import Disclaimer from "./components/Disclaimer";
import CatalogoSection from "./components/CatalogoSection";
import ComparadorForm from "./components/ComparadorForm";
import ResultadoSection from "./components/ResultadoSection";
import data from "./data.json";
import {
  calcularCustoMensal,
  normalizarPercentuais,
  percentuaisIniciais,
  percentuaisValidos,
  toNumber,
} from "./lib/calculo";

const provedores = Array.isArray(data.provedores) ? data.provedores : [];

export default function App() {
  const [volumeMensal, setVolumeMensal] = useState("");
  const [ticketMedio, setTicketMedio] = useState("");
  const [percentuais, setPercentuais] = useState(percentuaisIniciais());
  const [erro, setErro] = useState("");
  const [resultados, setResultados] = useState([]);
  const [catalogoFiltro, setCatalogoFiltro] = useState({
    maquininha: true,
    gateway: true,
  });
  const [resultadoFiltro, setResultadoFiltro] = useState({
    maquininha: true,
    gateway: true,
  });

  function handleChangePercentual(chave, valor) {
    setErro("");
    setPercentuais((atual) => ({ ...atual, [chave]: valor }));
  }

  function handleNormalizar() {
    const normalizado = normalizarPercentuais(percentuais);
    if (!normalizado) {
      setErro("Preencha ao menos um campo de distribuição antes de ajustar.");
      return;
    }
    setErro("");
    setPercentuais(normalizado);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    const volume = toNumber(volumeMensal);
    const ticket = toNumber(ticketMedio);

    if (volume <= 0 || ticket <= 0) {
      setErro("Informe volume mensal e ticket médio maiores que zero.");
      return;
    }

    if (!percentuaisValidos(percentuais)) {
      setErro("A soma dos percentuais deve ser exatamente 100%.");
      return;
    }

    if (provedores.length === 0) {
      setResultados([]);
      return;
    }

    const calculados = provedores
      .map((provedor) => calcularCustoMensal(volume, ticket, percentuais, provedor))
      .sort((a, b) => {
        if (a.completo && !b.completo) return -1;
        if (!a.completo && b.completo) return 1;
        return a.totalMensal - b.totalMensal;
      });

    setResultados(calculados);
  }

  return (
    <>
      <div className="perfuracao" aria-hidden="true"></div>
      <main className="container">
        <Hero />
        <Disclaimer />

        <CatalogoSection
          provedores={provedores}
          filtro={catalogoFiltro}
          onFiltroChange={setCatalogoFiltro}
        />

        <ComparadorForm
          volumeMensal={volumeMensal}
          ticketMedio={ticketMedio}
          percentuais={percentuais}
          onChangeVolume={setVolumeMensal}
          onChangeTicket={setTicketMedio}
          onChangePercentual={handleChangePercentual}
          onNormalizar={handleNormalizar}
          onSubmit={handleSubmit}
          erro={erro}
        />

        <ResultadoSection
          resultados={resultados}
          filtro={resultadoFiltro}
          onFiltroChange={setResultadoFiltro}
        />
      </main>
    </>
  );
}
