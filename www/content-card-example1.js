import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class ContentCardExample extends LitElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    const entityId = this.config.entity;
    const state = this.hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";

    return html`
      <ha-card header="My lit card">
        <div class="card-content">
          The state of ${entityId} is ${stateStr}!
          <br /><br />
        </div>
      </ha-card>
    `;
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define("content-card-example", ContentCardExample);
