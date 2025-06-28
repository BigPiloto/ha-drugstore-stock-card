from homeassistant import config_entries
import voluptuous as vol
from .const import (
    CONF_MEDICINES,
    CONF_NAME,
    CONF_INIT,
    CONF_MIN,
    CONF_MAX,
    CONF_UNIT,
    DOMAIN,
)
import logging

_LOGGER = logging.getLogger(__name__)

class DrugstoreStockOptionsFlowHandler(config_entries.OptionsFlow):
    """Options flow for Drugstore Stock."""

    def __init__(self, config_entry):
        self._config_entry = config_entry
        self._medicines = list(config_entry.options.get(CONF_MEDICINES, []))
        self.edit_index = None

    async def async_step_init(self, user_input=None):
        """Initial options step."""
        LANG = self.hass.config.language
        if LANG == "pt-BR":
            options = {
                "add": "Adicionar novo medicamento",
                "edit": "Editar medicamento existente",
                "remove": "Remover medicamento existente"
            }
        else:
            options = {
                "add": "Add new medicine",
                "edit": "Edit existing medicine",
                "remove": "Remove existing medicine"
            }
        
        schema = vol.Schema({
            vol.Required("action"): vol.In(options)
        })
        
        if user_input is not None:
            action = user_input["action"]
            selected_key = next((key for key, value in options.items() if value == action), None)
            if action == "add":
                return await self.async_step_add()
            elif action == "edit":
                return await self.async_step_select_edit()
            elif action == "remove":
                return await self.async_step_select_remove()

        return self.async_show_form(
            step_id="init",
            data_schema=schema
        )

    async def async_step_select_edit(self, user_input=None):
        if not self._medicines:
            return self.async_abort(reason="no_medicines")
        if user_input is not None:
            self.edit_index = int(user_input["medicine"])
            return await self.async_step_edit()
        choices = {str(i): med[CONF_NAME] for i, med in enumerate(self._medicines)}
        schema = vol.Schema({
            vol.Required("medicine"): vol.In(choices)
        })
        return self.async_show_form(
            step_id="select_edit",
            data_schema=schema
        )

    async def async_step_edit(self, user_input=None):
        med = self._medicines[self.edit_index]
        if user_input is not None:
            new_name = user_input[CONF_NAME].strip().lower()
            for idx, m in enumerate(self._medicines):
                if idx != self.edit_index and m[CONF_NAME].strip().lower() == new_name:
                    schema = self._medicine_schema(user_input)
                    return self.async_show_form(
                        step_id="edit",
                        data_schema=schema,
                        errors={"base": "duplicate_name"}
                    )
            self._medicines[self.edit_index] = {
                CONF_NAME: user_input[CONF_NAME],
                CONF_INIT: float(user_input[CONF_INIT]),
                CONF_MIN: float(user_input[CONF_MIN]),
                CONF_MAX: float(user_input[CONF_MAX]),
                CONF_UNIT: user_input[CONF_UNIT],
            }
            return await self.async_step_save()
        schema = self._medicine_schema(med)
        return self.async_show_form(
            step_id="edit",
            data_schema=schema
        )

    async def async_step_select_remove(self, user_input=None):
        if not self._medicines:
            return self.async_abort(reason="no_medicines")
        if user_input is not None:
            self.edit_index = int(user_input["medicine"])
            return await self.async_step_remove_confirm()
        choices = {str(i): med[CONF_NAME] for i, med in enumerate(self._medicines)}
        schema = vol.Schema({
            vol.Required("medicine"): vol.In(choices)
        })
        return self.async_show_form(
            step_id="select_remove",
            data_schema=schema
        )

    async def async_step_remove_confirm(self, user_input=None):
        med = self._medicines[self.edit_index]
        if user_input is not None:
            if user_input["confirm"]:
                self._medicines.pop(self.edit_index)
            return await self.async_step_save()
        schema = vol.Schema({
            vol.Required("confirm", default=False): bool,
        })
        return self.async_show_form(
            step_id="remove_confirm",
            data_schema=schema,
            description_placeholders={"med_name": med[CONF_NAME]}
        )

    async def async_step_add(self, user_input=None):
        schema = self._medicine_schema(user_input)
        if user_input is not None:
            new_name = user_input[CONF_NAME].strip().lower()
            for med in self._medicines:
                if med[CONF_NAME].strip().lower() == new_name:
                    return self.async_show_form(
                        step_id="add",
                        data_schema=schema,
                        errors={"base": "duplicate_name"}
                    )
            self._medicines.append({
                CONF_NAME: user_input[CONF_NAME],
                CONF_INIT: float(user_input[CONF_INIT]),
                CONF_MIN: float(user_input[CONF_MIN]),
                CONF_MAX: float(user_input[CONF_MAX]),
                CONF_UNIT: user_input[CONF_UNIT],
            })
            return await self.async_step_save()
        return self.async_show_form(
            step_id="add",
            data_schema=schema
        )

    def _medicine_schema(self, data):
        """Builds the medicine form schema."""
        def _get(field, default):
            if data and isinstance(data, dict):
                return data.get(field, default)
            return default
        return vol.Schema({
            vol.Required(CONF_NAME, default=_get(CONF_NAME, "")): str,
            vol.Required(CONF_INIT, default=_get(CONF_INIT, 0.0)): vol.Coerce(float),
            vol.Required(CONF_MIN, default=_get(CONF_MIN, 0.0)): vol.Coerce(float),
            vol.Required(CONF_MAX, default=_get(CONF_MAX, 100.0)): vol.Coerce(float),
            vol.Required(CONF_UNIT, default=_get(CONF_UNIT, "units")): str,
        })

    async def async_step_save(self):
        try:
            _LOGGER.error(f"Entrando no async_step_save: _medicines = {self._medicines}")
            for med in self._medicines:
                assert "name" in med, med
                assert "initial_value" in med, med
                assert "min_value" in med, med
                assert "max_value" in med, med
                assert "unit" in med, med

            return self.async_create_entry(
                title="",
                data={CONF_MEDICINES: self._medicines}
            )
        except Exception as e:
            _LOGGER.error(f"[DrugstoreStock] Error in async_step_save: {e}")
            return self.async_abort(reason="internal_error")
