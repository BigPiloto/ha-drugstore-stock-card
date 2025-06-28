import { LitElement, html, css } from "https://unpkg.com/lit@2.7.5/index.js?module";

window.customCards = window.customCards || [];
window.customCards.push({
  type: "drugstore-stock-card",
  name: "Drugstore Stock Card",
  description: "Card for Remedy Stock Control"
});

// --------- CARD PRINCIPAL ---------
class DrugstoreStockCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
  };

  static styles = css`
    ha-card {
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px 0 rgba(0,0,0,0.16));
      padding: 0;
    }
    .stock-list {
      display: flex;
      flex-direction: column;
    }
    .stock-row {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      background: none;
    }
    .clickable-area {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      cursor: pointer;
      height: 100%;
    }
    .icon {
      margin-right: 14px;
      font-size: 1.7em;
      color: var(--state-icon-color, var(--primary-text-color));
    }
    .name {
      font-weight: 500;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 14px;
      flex: 1 1 0;
      display: flex;
      align-items: center;
    }
    .value-box {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: auto;
    }
    .btn.minus, .btn.plus {
      margin: 0;
      padding: 0;
      align-items: center;
      justify-content: center;
    }
    .btn {
      width: 28px;
      height: 28px;
      background: rgba(128, 128, 128, 0.2);
      border: none;
      border-radius: 5px;
      font-size: 1.1em;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: background 0.2s;
      color: var(--primary-text-color, #fff);
    }
    .btn:active {
      background: var(--primary-color, #1565c0);
      color: #fff;
    }
    .value {
      width: 32px;
      text-align: center;
      font-size: 1.24em;
      font-variant-numeric: tabular-nums;
    }
    .unit {
      color: var(--secondary-text-color);
      font-size: 1em;
      margin-left: 4px;
      margin-right: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  static getStubConfig(hass, entities) {
    const numberEntities = entities.filter(eid => eid.startsWith("number."));
    return {
      type: "custom:drugstore-stock-card",
      entities: numberEntities.slice(0, 1).map(eid => ({
        entity: eid,
        name: "",
        icon: "",
        unit: ""
      }))
    };
  }

  static getConfigElement() {
    return document.createElement("drugstore-stock-card-editor");
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("Define the 'Entities' list'!");
    }
    this.config = config;
  }

  render() {
    if (!this.config || !this.hass) return html``;
    return html`
      <ha-card>
        <div class="stock-list">
          ${this.config.entities
            .filter(item => item.entity)
            .map((item, idx) => {
              const stateObj = this.hass.states[item.entity];
              if (!stateObj) {
                return html`
                  <div class="stock-row">
                    <span class="name">${item.name || item.entity}</span>
                    <span style="color:red;">Entity not found</span>
                  </div>
                `;
              }
              const value = Number(stateObj.state);
              const icon = item.icon || stateObj.attributes.icon || "mdi:plus-minus-variant";
              const unit = item.unit || stateObj.attributes.unit_of_measurement || "";
              const name = item.name || stateObj.attributes.friendly_name || item.entity;
              const icon_plus = item.icon_plus || "mdi:plus";
              const icon_minus = item.icon_minus || "mdi:minus";

              return html`
                <div class="stock-row" data-entity=${item.entity}>
                  <div class="clickable-area" @click=${() => this._showMoreInfo(item.entity)}>
                    <ha-icon class="icon" .icon=${icon}></ha-icon>
                    <span class="name">${name}</span>
                  </div>
                  <div class="value-box">
                    <span class="value">${value}</span>
                    <span class="unit">${unit}</span>
                    <button class="btn minus" @click=${e => this._changeValue(e, idx, -1)}>
                      <ha-icon .icon=${icon_minus}></ha-icon>
                    </button>         
                    <button class="btn plus" @click=${e => this._changeValue(e, idx, 1)}>
                      <ha-icon .icon=${icon_plus}></ha-icon>
                    </button>
                  </div>
                </div>
              `;
            })}
        </div>
      </ha-card>
    `;
  }

  _showMoreInfo(entityId) {
    const ev = new CustomEvent("hass-more-info", {
      bubbles: true, composed: true, detail: { entityId }
    });
    this.dispatchEvent(ev);
  }

  _changeValue(e, idx, delta) {
    e.stopPropagation();
    const item = this.config.entities[idx];
    const stateObj = this.hass.states[item.entity];
    if (!stateObj) return;
    const value = Number(stateObj.state);
    const min = stateObj.attributes.min || 0;
    const max = stateObj.attributes.max || 100;
    let newValue = value + delta;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    this.hass.callService("number", "set_value", {
      entity_id: item.entity,
      value: newValue
    });
  }
}
customElements.define('drugstore-stock-card', DrugstoreStockCard);

// --------- EDITOR VISUAL (UI Editor) ---------

class DrugstoreStockCardEditor extends LitElement {
  static properties = {
    hass: {},
    config: {},
    editingIdx: { type: Number },
    _haComponentsLoaded: { type: Boolean, state: true },
    _draggingIdx: { type: Number, state: true },
  };

  constructor() {
    super();
    this.editingIdx = null;
    this._haComponentsLoaded = false;
    this._draggingIdx = null;
  }

  static styles = css`
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      transition: background-color 0.2s ease-in-out;
      border: 1px solid transparent;
    }
    .row.dragging {
      opacity: 0.5;
      background-color: var(--primary-background-color);
      border: 1px dashed var(--primary-color);
    }
    .row.drag-over-top {
      border-top: 2px solid var(--primary-color);
    }
    .row.drag-over-bottom {
      border-bottom: 2px solid var(--primary-color);
    }
    ha-entity-picker {
      flex: 1 1 0;
    }
    ha-entity-picker:active {
      min-width: 0;
    }
    .edit-btn, .del-btn {
      background: none;
      border: none;
      border-radius: 50%;
      width: 36px; height: 36px;
      color: var(--primary-text-color, #cfd8dc);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
    }
    .edit-btn:hover, .del-btn:hover {
      background: rgba(255,255,255,0.07);
      color: var(--primary-color, #03a9f4);
    }
    .edit-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 10px;
      margin-bottom: 18px;
      margin-top: 10px;
    }
    .edit-fields ha-textfield {
      width: 100%;
    }
    .back-btn {
      background: none;
      border: none;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 1.08em;
      margin-bottom: 12px;
      padding: 4px 0;
    }
    .add-entity-row {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .drag-handle {
      cursor: grab; /* Indica que o elemento é arrastável */
      padding-right: 10px; /* Espaço entre o ícone e o picker */
      display: flex;
      align-items: center;
      color: var(--secondary-text-color); /* Cor mais sutil */
    }
    .drag-handle:active {
      cursor: grabbing;
    }
  `;

  async connectedCallback() {
      super.connectedCallback();
      await this._loadHaComponents();
  }

  async _loadHaComponents() {
    const haEntityPickerTag = "ha-entity-picker";
    const haTextfieldTag = "ha-textfield";
    const haIconPickerTag = "ha-icon-picker";
    const haSwitchTag = "ha-switch";

    if (
        customElements.get(haEntityPickerTag) &&
        customElements.get(haTextfieldTag) &&
        customElements.get(haIconPickerTag) &&
        customElements.get(haSwitchTag)
    ) {
        this._haComponentsLoaded = true;
        return;
    }

    if (!window.loadCardHelpers) {
      await import("https://unpkg.com/custom-card-helpers@1.14.0/dist/index.mjs")
        .then(m => window.loadCardHelpers = m.loadCardHelpers);
    }
    await window.loadCardHelpers();

    try {
        const partialPanelResolverTag = "partial-panel-resolver";
        await customElements.whenDefined(partialPanelResolverTag);
        const p = document.createElement(partialPanelResolverTag);
        p.hass = {panels: [{url_path: "tmp", component_name: "config"}]};
        p._updateRoutes();
        await p.routerOptions.routes.tmp.load();
        
        const haPanelConfigTag = "ha-panel-config";
        await customElements.whenDefined(haPanelConfigTag);
        const d = document.createElement(haPanelConfigTag);
        if (d.routerOptions && d.routerOptions.routes && d.routerOptions.routes.automation) {
           await d.routerOptions.routes.automation.load();
        }

        document.createElement(haEntityPickerTag);
        document.createElement(haTextfieldTag);
        document.createElement(haIconPickerTag);
        document.createElement(haSwitchTag);

    } catch (e) {
        console.warn("Failed to load HA core components via _loadHaComponents", e);
    }

    this._haComponentsLoaded = true;
    this.requestUpdate();
  }

  setConfig(config) {
    this.config = { ...config };
  }

  render() {
    if (!this.hass || !this._haComponentsLoaded) {
      return html`
        <ha-card style="padding: 20px; text-align: center;">
          Loading editor...
        </ha-card>
      `;
    }

    const entities = (this.config.entities || []);

    // Editing entity screen
    if (this.editingIdx !== null) {
      const item = entities[this.editingIdx] || {};
      return html`
        <button class="back-btn" @click=${() => { this.editingIdx = null; }}>
          &#8592; Back
        </button>
        <div class="edit-fields">
          <ha-entity-picker
            label="Entity (required)"
            .hass=${this.hass}
            .value=${item.entity}
            .includeDomains=${["number"]}
            allow-custom-entity
            @value-changed=${e => this._updateEntity(this.editingIdx, "entity", e.detail.value)}
          ></ha-entity-picker>
          <ha-textfield
            label="Name"
            .value=${item.name || ""}
            @input=${e => this._updateEntity(this.editingIdx, "name", e.target.value)}
          ></ha-textfield>
          <ha-icon-picker
            label="Icon"
            .hass=${this.hass}
            .value=${item.icon || ""}
            @value-changed=${e => this._updateEntity(this.editingIdx, "icon", e.detail.value)}
          ></ha-icon-picker>
          <ha-textfield
            label="Unit"
            .value=${item.unit || ""}
            @input=${e => this._updateEntity(this.editingIdx, "unit", e.target.value)}
          ></ha-textfield>
          <ha-icon-picker
            label="Icon +"
            .hass=${this.hass}
            .value=${item.icon_plus || "mdi:plus"}
            @value-changed=${e => this._updateEntity(this.editingIdx, "icon_plus", e.detail.value)}
          ></ha-icon-picker>
          <ha-icon-picker
            label="Icon -"
            .hass=${this.hass}
            .value=${item.icon_minus || "mdi:minus"}
            @value-changed=${e => this._updateEntity(this.editingIdx, "icon_minus", e.detail.value)}
          ></ha-icon-picker>
        </div>
      `;
    }

    // Entity list and add row
    return html`
      <div>
        ${entities.map((item, idx) => html`
          <div
            class="row ${this._draggingIdx === idx ? 'dragging' : ''}"
            @dragover=${e => this._dragOver(e, idx)}
            @dragleave=${e => this._dragLeave(e)}
            @drop=${e => this._drop(e, idx)}
            @dragend=${this._dragEnd}
          >
            <div
              class="drag-handle"
              draggable="true"
              @dragstart=${e => this._dragStart(e, idx)}
            >
              <ha-icon icon="mdi:drag-vertical"></ha-icon>
            </div>
            <ha-entity-picker
              .hass=${this.hass}
              .value=${item.entity || ""}
              .includeDomains=${["number"]}
              allow-custom-entity
              @value-changed=${e => this._updateEntity(idx, "entity", e.detail.value)}
            ></ha-entity-picker>
            ${item.entity ? html`
              <button class="edit-btn" @click=${() => this._editEntity(idx)} title="Edit">
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
              <button class="del-btn" @click=${() => this._removeEntity(idx)} title="Remove">
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            ` : ""}
          </div>
        `)}
        <div class="row add-entity-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${""}
            label="Add entity"
            .includeDomains=${["number"]}
            allow-custom-entity
            @value-changed=${e => this._addEntityFromPicker(e.detail.value)}
          ></ha-entity-picker>
        </div>
      </div>
    `;
  }

  _editEntity(idx) { this.editingIdx = idx; }

  _updateEntity(idx, key, value) {
    const entities = [...(this.config.entities || [])];
    if (key === "entity" && !value) {
        this._removeEntity(idx);
        return;
    }
    entities[idx] = { ...entities[idx], [key]: value };
    this.config = { ...this.config, entities };
    this._fireConfigChanged();
  }

  _removeEntity(idx) {
    const entities = [...(this.config.entities || [])];
    entities.splice(idx, 1);
    this.config = { ...this.config, entities };
    this._fireConfigChanged();
  }

  _addEntityFromPicker(entity_id) {
    if (!entity_id) return;
    if ((this.config.entities || []).some(e => e.entity === entity_id)) {
        const existingIdx = (this.config.entities || []).findIndex(e => e.entity === entity_id);
        if (existingIdx !== -1) {
            this.editingIdx = existingIdx;
        }
        return;
    }
    const entities = [...(this.config.entities || []), { entity: entity_id }];
    this.config = { ...this.config, entities };
    this._fireConfigChanged();
    this.editingIdx = entities.length - 1;
  }

  // --- Funções de Drag and Drop ---
  _dragStart(e, idx) {
    this._draggingIdx = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', idx); // Armazena o índice do item arrastado
    
    // Adiciona uma pequena pausa para o navegador capturar o 'snapshot' do elemento
    // e para a classe 'dragging' ser aplicada antes da imagem de arrasto ser criada.
    setTimeout(() => {
      if (e.target.closest('.row')) { // <-- Modificação aqui: garantir que a classe seja adicionada ao elemento 'row' pai
        e.target.closest('.row').classList.add('dragging');
      }
    }, 0);
  }

  _dragOver(e, idx) {
    e.preventDefault(); // Necessário para permitir o drop
    if (this._draggingIdx === null || this._draggingIdx === idx) {
      return;
    }

    const targetRow = e.currentTarget;
    const boundingBox = targetRow.getBoundingClientRect();
    const offset = e.clientY - boundingBox.top;

    // Remove as classes de feedback de todas as linhas
    Array.from(this.shadowRoot.querySelectorAll('.row')).forEach(row => {
        row.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    if (offset < boundingBox.height / 2) {
      // Arrastando sobre a metade superior
      targetRow.classList.add('drag-over-top');
      this._dropPosition = 'before'; // O item será solto antes deste
    } else {
      // Arrastando sobre a metade inferior
      targetRow.classList.add('drag-over-bottom');
      this._dropPosition = 'after'; // O item será solto depois deste
    }
  }

  _dragLeave(e) {
    e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
  }

  _drop(e, targetIdx) {
    e.preventDefault();
    e.stopPropagation();

    const draggedIdx = this._draggingIdx;
    if (draggedIdx === null || draggedIdx === targetIdx) {
      return;
    }

    const entities = [...(this.config.entities || [])];
    const [draggedItem] = entities.splice(draggedIdx, 1); // Remove o item da posição original

    let newIndex = targetIdx;
    if (this._dropPosition === 'after' && draggedIdx < targetIdx) {
        newIndex = targetIdx; // Se arrastou para baixo e soltou *depois* do alvo
    } else if (this._dropPosition === 'after' && draggedIdx > targetIdx) {
        newIndex = targetIdx + 1; // Se arrastou para cima e soltou *depois* do alvo
    } else if (this._dropPosition === 'before' && draggedIdx < targetIdx) {
        newIndex = targetIdx -1 ; // Se arrastou para baixo e soltou *antes* do alvo
    } else if (this._dropPosition === 'before' && draggedIdx > targetIdx) {
        newIndex = targetIdx; // Se arrastou para cima e soltou *antes* do alvo
    }

    // Garante que o índice não vá além dos limites
    newIndex = Math.max(0, Math.min(newIndex, entities.length));
    
    entities.splice(newIndex, 0, draggedItem); // Insere o item na nova posição

    this.config = { ...this.config, entities };
    this._fireConfigChanged();

    // Limpa os estados de arrasto
    this._draggingIdx = null;
    this._dropPosition = null;
    Array.from(this.shadowRoot.querySelectorAll('.row')).forEach(row => {
        row.classList.remove('drag-over-top', 'drag-over-bottom', 'dragging');
    });
  }

  _dragEnd(e) {
    this._draggingIdx = null;
    this._dropPosition = null;
    // Garante que a classe 'dragging' seja removida em todos os casos
    Array.from(this.shadowRoot.querySelectorAll('.row')).forEach(row => {
        row.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');
    });
  }
  // --- Fim das Funções de Drag and Drop ---

  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config },
      bubbles: true, composed: true
    }));
  }
}
customElements.define("drugstore-stock-card-editor", DrugstoreStockCardEditor);