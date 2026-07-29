# Comparador de Taxas

Site estático para comparar o custo mensal estimado entre maquininhas e gateways de pagamento, com base no seu volume de vendas, ticket médio e mix de meios de pagamento (débito, crédito 1x/2x-6x/7x-12x, pix, boleto).

## Stack

- HTML, CSS e JavaScript puros — sem build, sem dependências.
- `data.json` como "banco de dados": array de provedores com taxas, mensalidade, taxa de adesão, antecipação e fonte oficial.

## Rodando localmente

Como o `script.js` usa `fetch("data.json")`, é preciso servir os arquivos por HTTP (não abrir o `index.html` direto via `file://`):

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Dados dos provedores

Cada registro em `data.json` segue a estrutura documentada em `_exemplo_estrutura_provedor`. Ao adicionar ou atualizar um provedor, use apenas taxas confirmadas em fonte oficial pública — se não houver tarifário público confiável, prefira deixar o provedor de fora a estimar um número.

⚠️ Os valores exibidos no site são estimativas com base em taxas públicas; as taxas reais variam por negociação, volume e plano contratado.
