![hacs custom](https://img.shields.io/badge/hacs-custom-orange.svg)
![HACS Default](https://img.shields.io/badge/HACS-Default-blue.svg)
![HACS Action](https://github.com/BigPiloto/ha-drugstore-stock-card/actions/workflows/validate.yaml/badge.svg)
![Release](https://img.shields.io/github/v/release/BigPiloto/ha-drugstore-stock-card.svg)
![Downloads](https://img.shields.io/github/downloads/BigPiloto/ha-drugstore-stock-card/total.svg)
![Last commit](https://img.shields.io/github/last-commit/BigPiloto/ha-drugstore-stock-card.svg)

# Drugstore Stock Card

Card personalizado para exibir e editar o estoque de remédios integrado ao Home Assistant.

Esse cartão foi pensado para complementar a integração [Drugstore Stock](https://github.com/BigPiloto/ha-drugstore-stock)

![Preview of Drugstore Stock Card Gif](images/exemplo_card.gif)

## Visão Geral

O Drugstore Stock Card é um card frontend para o Home Assistant que se integra à integração Drugstore Stock, permitindo visualizar, gerenciar e atualizar facilmente seu estoque de medicamentos pelo dashboard.

## Instalação

### Agora estamos na loja oficial do HACS!
Instale facilmente este cartão diretamente pelo Home Assistant Community Store.

### Método 1: Instalação via HACS (Recomendado)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=BigPiloto&repository=ha-drugstore-stock-card&category=plugin)
1. Vá em **`HACS` > `3 pontos` > `Custom repositories`**
2. Adicione: `https://github.com/BigPiloto/ha-drugstore-stock-card`
3. Selecione a categoria: **`Dashboard`**
4. Clique em **`ADD`**
5. Encontre e clique em `Drugstore Stock` na lista de integrações
6. Clique em **`Download`** e instale
7. Clique em **`Reload`**

### Método 2: Instalação manual
1. Baixe o arquivo `drugstore-stock-card.js`
2. Coloque-o na pasta `/config/www/` do seu Home Assistant
3. Em **`Configurações` > `Dashboards` > `3 pontos` > `Recursos` > `Adicionar Recurso`**
4. Adicione `/local/drugstore-stock-card.js` na URL
5. Selecione **`Módulo JavaScript`**
6. Clique em **`Criar`**

## Uso

[Uso via Editor Visual](documentation/examples-ui.pt-BR.md)

[Uso via Editor de Código](documentation/examples-code.pt-BR.md)

## Prints

![Preview of Drugstore Stock Card](images/preview_card.png)

## Suporte e Bugs

- Relate problemas ou sugestões em: [Issues](https://github.com/BigPiloto/ha-drugstore-stock-card/issues)

## Licença

Este projeto está licenciado sob a licença do MIT - consulte o arquivo [MIT License](LICENSE) para obter detalhes.
