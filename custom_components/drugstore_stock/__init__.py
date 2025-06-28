from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform

from .const import DOMAIN

import logging
_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.NUMBER]

async def async_setup(hass: HomeAssistant, config: dict):
    """Set up Drugstore Stock component (YAML mode, legacy)."""
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up a config entry for Drugstore Stock."""
    _LOGGER.debug("Setting up entry: %s with options: %s", entry.entry_id, entry.options)
    
    # Armazene dados para acesso futuro (opcional)
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.options.copy()
    
    # Registra o listener para atualizar/recarregar se options mudarem
    entry.async_on_unload(entry.add_update_listener(update_listener))

    # Forward para as plataformas (number)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        # Limpe o registro em hass.data (opcional, mas bom para evitar leaks)
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok

async def update_listener(hass: HomeAssistant, entry: ConfigEntry):
    """Reload when options or config are updated."""
    _LOGGER.debug("Reloading Drugstore Stock entry: %s", entry.entry_id)
    await hass.config_entries.async_reload(entry.entry_id)
