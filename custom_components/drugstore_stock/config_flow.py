from homeassistant import config_entries
import voluptuous as vol
from homeassistant.helpers import selector
from homeassistant.core import callback
from .const import DOMAIN, CONF_LIST_NAME, CONF_LOCATION, CONF_MEDICINES

import logging
_LOGGER = logging.getLogger(__name__)

class DrugstoreStockConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}

        if user_input is not None:
            # Verifica se já existe lista com o mesmo nome (case-insensitive)
            existing = [
                entry
                for entry in self._async_current_entries()
                if entry.data.get(CONF_LIST_NAME, "").strip().lower()
                == user_input[CONF_LIST_NAME].strip().lower()
            ]
            if existing:
                errors[CONF_LIST_NAME] = "duplicate"
                _LOGGER.warning("Tentativa de criar lista duplicada: %s", user_input[CONF_LIST_NAME])
            else:
                _LOGGER.info("Criando novo estoque de medicamentos: %s", user_input[CONF_LIST_NAME])
                return self.async_create_entry(
                    title=user_input[CONF_LIST_NAME],
                    data=user_input,
                    options={CONF_MEDICINES: []}
                )

        schema = vol.Schema({
            vol.Required(CONF_LIST_NAME): str,
            vol.Optional(CONF_LOCATION): selector.AreaSelector(),
        })

        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: config_entries.ConfigEntry):
        from .options_flow import DrugstoreStockOptionsFlowHandler
        return DrugstoreStockOptionsFlowHandler(config_entry)
