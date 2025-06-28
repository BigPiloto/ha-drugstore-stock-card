![hacs custom](https://img.shields.io/badge/hacs-custom-orange.svg)
![HACS Action](https://github.com/BigPiloto/ha-drugstore-stock-card/actions/workflows/hacs.yaml/badge.svg)
![Release](https://img.shields.io/github/v/release/BigPiloto/ha-drugstore-stock.svg)
![Downloads](https://img.shields.io/github/downloads/BigPiloto/ha-drugstore-stock/total.svg)
![Last commit](https://img.shields.io/github/last-commit/BigPiloto/ha-drugstore-stock.svg)

<!-- ![HACS Default](https://img.shields.io/badge/HACS-Default-blue.svg) Colocar na linha 2-->

# Drugstore Stock Card

Card personalizado para exibir e editar o estoque de remédios integrado ao Home Assistant.

## Visão Geral

O Drugstore Stock Card é um card frontend para o Home Assistant que se integra à integração Drugstore Stock, permitindo visualizar, gerenciar e atualizar facilmente seu estoque de medicamentos pelo dashboard.

## Instalação

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=BigPiloto&repository=ha-drugstore-stock-card&category=dashboard)

### Método 1: Instalação via HACS (Recomendado)
1. Vá em **`HACS` > `3 pontos` > `Custom repositories`**
2. Adicione: `https://github.com/BigPiloto/ha-drugstore-stock-card`
3. Selecione a categoria: **`Dashboard`**
4. Clique em **`ADD`**
5. Encontre e clique em `Drugstore Stock` na lista de integrações
6. Clique em **`Download`** e instale
7. Instale e reinicie o Home Assistant.

### Manual
1. Baixe o arquivo `drugstore-stock-card.js`.
2. Coloque-o na pasta `/config/www/` do seu Home Assistant.
3. Em **Configurações > Painéis > Recursos**, adicione `/local/drugstore-stock-card.js` como recurso.

## Uso

Adicione no seu Lovelace:

```yaml
type: custom:drugstore-stock-card
```

> Detalhe aqui as opções e exemplos de uso do seu card.

## Prints

> Adicione aqui imagens/gifs do card em funcionamento!

## Suporte e Bugs

- Relate problemas ou sugestões em: [Issues](https://github.com/BigPiloto/ha-drugstore-stock-card/issues)

## Licença

[MIT License](LICENSE)
