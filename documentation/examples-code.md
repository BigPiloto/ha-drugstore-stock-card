# Adding a New Card 📋

1. Go to **`Edit dashboard` > `+ Add Card`**
2. Search for **`Manual`**
3. The code editor will open blank
4. Fill in the configuration as described in the table below
   
### Options

| Nome          | Tipo    | Required | Description                            | Default                                   |
|---------------|---------|----------|----------------------------------------|-------------------------------------------|
| `type`        | string  | Yes      | Must be `custom:drugstore-stock-card`  | —                                         |
| `entities`    | string  | Yes      | Required to define the entities        | —                                         |
| `entity`      | string  | Yes      | Selected entity                        | —                                         |
| `name`        | string  | No       | Display name for the entity            | Entity name defined in the configuration  |
| `icon`        | string  | No       | HA icon for the entity                 | mdi:plus-minus-variant                    |
| `unit`        | string  | No       | Unit of measurement for the entity     | Unit defined in the configuration         |
| `icon_plus`   | string  | No       | Icon for the add/+1 button             | mdi:plus                                  |
| `icon_minus`  | string  | No       | Icon for the subtract/-1 button        | mdi:minus                                 |


### Complete example:

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

![Example ready card](../images/preview_card.png)
