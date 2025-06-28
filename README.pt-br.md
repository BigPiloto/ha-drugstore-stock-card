# Drugstore Stock Card

Card personalizado para exibir e editar o estoque de remédios integrado ao Home Assistant.

## Visão Geral

O Drugstore Stock Card é um card frontend para o Home Assistant que se integra à integração Drugstore Stock, permitindo visualizar, gerenciar e atualizar facilmente seu estoque de medicamentos pelo dashboard.

## Instalação

### Via HACS (recomendado)
1. Vá em **HACS > Frontend > 3 pontinhos > Repositórios personalizados**
2. Adicione: `https://github.com/BigPiloto/ha-drugstore-stock-card`
3. Selecione a categoria: **Frontend**
4. Instale e reinicie o Home Assistant.

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
