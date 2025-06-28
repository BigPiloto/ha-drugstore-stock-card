# Drugstore Stock Card

[🇧🇷 Read in Brazilian Portuguese](README.pt-br.md)

A custom card to display and edit your medicine stock in Home Assistant.

## Overview

Drugstore Stock Card is a frontend card for Home Assistant that integrates with the Drugstore Stock integration, allowing you to easily view, manage and update your medicine inventory from your dashboard.

## Installation

### Via HACS (recommended)
1. Go to **HACS > Frontend > 3 dots > Custom repositories**
2. Add: `https://github.com/BigPiloto/ha-drugstore-stock-card`
3. Select category: **Frontend**
4. Install and restart Home Assistant.

### Manual
1. Download `drugstore-stock-card.js`.
2. Place it in your Home Assistant `/config/www/` directory.
3. In **Settings > Dashboards > Resources**, add `/local/drugstore-stock-card.js` as a resource.

## Usage

Add to your Lovelace dashboard:

```yaml
type: custom:drugstore-stock-card
```

> Add here options and usage examples for your card.

## Screenshots

> Add images/gifs of the card in action!

## Support & Issues

- Report bugs or suggestions at: [Issues](https://github.com/BigPiloto/ha-drugstore-stock-card/issues)

## License

[MIT License](LICENSE)
