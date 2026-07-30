# Comparador de Taxas

Site estático para comparar o custo mensal estimado entre maquininhas e gateways de pagamento, com base no seu volume de vendas, ticket médio e mix de meios de pagamento (débito, crédito 1x/2x-6x/7x-12x, pix, boleto).

## Stack

- React + Vite.
- `src/data.json` como "banco de dados": array de provedores com taxas, mensalidade, taxa de adesão, antecipação e fonte oficial (importado direto no bundle, sem fetch em runtime).
- `src/lib/calculo.js` concentra a lógica de cálculo/validação; `src/components` tem os componentes de UI.

## Rodando localmente

```bash
npm install
npm run dev
```

Depois acesse o endereço impresso no terminal (por padrão `http://localhost:5173`).

Para gerar o build de produção (o que o Vercel roda no deploy):

```bash
npm run build
npm run preview   # opcional, serve o build localmente
```

## Dados dos provedores

Cada registro em `src/data.json` segue a estrutura documentada em `_exemplo_estrutura_provedor`. Ao adicionar ou atualizar um provedor, use apenas taxas confirmadas em fonte oficial pública — se não houver tarifário público confiável, prefira deixar o provedor de fora a estimar um número.

⚠️ Os valores exibidos no site são estimativas com base em taxas públicas; as taxas reais variam por negociação, volume e plano contratado.
