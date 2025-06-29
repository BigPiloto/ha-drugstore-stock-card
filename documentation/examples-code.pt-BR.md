# Adicionando um novo card 📋

1. Vá em **`Editar dashboard` > `+ Adicionar Cartão`**
2. Procure por **`Manual`**
3. Irá abrir o editor de código em branco
4. Preencha a configuração conforme tabela abaixo
   
### Opções

| Nome          | Tipo    | Necessário | Descrição                              | Padrão                                    |
|---------------|---------|------------|----------------------------------------|-------------------------------------------|
| `type`        | string  | Sim        | Deve ser `custom:drugstore-stock-card` | —                                         |
| `entities`    | string  | Sim        | Obrigatório para definir as entidades  | —                                         |
| `entity`      | string  | Sim        | Entidade escolhida                     | —                                         |
| `name`        | string  | Não        | Nome de visualização da entidade       | Nome da entidade definido na configuração |
| `icon`        | string  | Não        | Ícone HA para a entidade               | mdi:plus-minus-variant                    |
| `unit`        | string  | Não        | Unidade de medida da entidade          | Unidade definida na configuração          |
| `icon_plus`   | string  | Não        | Ícone para o botão de adição/+1        | mdi:plus                                  |
| `icon_minus`  | string  | Não        | Ícone para o botão de subtração/-1     | mdi:minus                                 |


### Exemplo completo:

``` yaml
type: custom:drugstore-stock-card
entities:
  - entity: number.nova_lista_paractamol
    name: Paractamol
    icon: mdi:pill
    unit: units
    icon_plus: mdi:plus
    icon_minus: mdi:minus
  - entity: number.nova_lista_ibuprofeno
    name: Ibuprofeno
```

![Exemplo de cartão pronto](../images/preview_card.png)
