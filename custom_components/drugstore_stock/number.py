from homeassistant.components.number import NumberEntity
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.util import slugify
from homeassistant.helpers.restore_state import RestoreEntity # NOVO
from .const import (
    DOMAIN, CONF_LOCATION, CONF_MEDICINES, CONF_NAME,
    CONF_MIN, CONF_MAX, CONF_INIT, CONF_UNIT
)
import logging

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass, entry, async_add_entities):
    """Set up Drugstore Stock numbers from a config entry."""
    medicines = entry.options.get(CONF_MEDICINES, [])
    location = entry.data.get(CONF_LOCATION)
    entities = []

    if not medicines:
        _LOGGER.warning(
            "No medicines found yet for entry %s. Add medicines in integration options.", entry.entry_id
        )
        return

    _LOGGER.debug("Setting up numbers for entry: %s with medicines: %s", entry.entry_id, medicines)

    for med in medicines:
        unique_id = f"{entry.entry_id}_{slugify(str(med[CONF_NAME]))}"
        entities.append(
            DrugstoreStockNumber(
                entry,
                name=med[CONF_NAME],
                min_value=float(med[CONF_MIN]),
                max_value=float(med[CONF_MAX]),
                initial_value=float(med[CONF_INIT]),
                unit=med[CONF_UNIT],
                location=location,
                unique_id=unique_id
            )
        )
    if entities:
        async_add_entities(entities)
        _LOGGER.info("Added %s DrugstoreStockNumber entities for entry %s", len(entities), entry.entry_id)
    else:
        _LOGGER.warning("No medicines found to create entities for entry %s", entry.entry_id)

class DrugstoreStockNumber(NumberEntity, RestoreEntity):
    """Entity representing a single medicine's stock."""

    _attr_has_entity_name = True

    def __init__(self, entry, name, min_value, max_value, initial_value, unit, location, unique_id):
        self._attr_name = name
        self._attr_unique_id = unique_id
        self._attr_native_min_value = min_value
        self._attr_native_max_value = max_value
        self._attr_native_value = initial_value
        self._attr_native_unit_of_measurement = unit
        self._attr_device_info = DeviceInfo(
            identifiers = {(DOMAIN, entry.entry_id)},
            name = entry.title,
            manufacturer = "Drugstore Stock",
            model = "Medicine List",
            suggested_area = location,
        )
        self._attr_extra_state_attributes = {
            "location": location,
            "list_entry": entry.entry_id,
        }
        _LOGGER.debug("Created DrugstoreStockNumber: %s (min=%s, max=%s, initial=%s, unit=%s)",
                      name, min_value, max_value, initial_value, unit)

    async def async_added_to_hass(self):
        """Restore previous value on restart."""
        await super().async_added_to_hass()
        last_state = await self.async_get_last_state()
        if last_state and last_state.state not in (None, 'unknown', 'unavailable'):
            try:
                self._attr_native_value = float(last_state.state)
            except ValueError:
                pass

    @property
    def native_value(self):
        return self._attr_native_value

    async def async_set_native_value(self, value: float) -> None:
        _LOGGER.debug("Setting value for %s to %s", self._attr_name, value)
        self._attr_native_value = value
        self.async_write_ha_state()
