import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

//import "raw.githubusercontent.com/home-assistant/frontend/20231030.1/src/components/ha-svg-icon";

class IDOSCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    var text_departure_config = {
      type: "entity",
      entity: this.config.text_departure_entity,
      state_color: false,
      name: "From",
      icon: "noa",
    };

    var text_arrival_config = structuredClone(text_departure_config);
    text_arrival_config.entity = this.config.text_arrival_entity;
    text_arrival_config.name = "To";

    return html`
      <ha-card>
        <div class="card-content">
          <div class="station-selection-wrapper">
            <span class="station-selection">
              <hui-entity-card
                style="ha-card: {--ha-card-border-width: none;}"
                .hass=${this.hass}
                ._config=${text_departure_config}
              ></hui-entity-card>
              <hui-entity-card
                .hass=${this.hass}
                ._config=${text_arrival_config}
              ></hui-entity-card>
            </span>
          </div>
          ${!this.config
            ? ""
            : this.config.entities.map((ent) => {
                const stateObj = this.hass.states[ent];

                if (!stateObj) {
                  return html`
                    ${this.#_showError("Unknown entity '" + ent + "'")}
                  `;
                }

                var attributes = stateObj.attributes;
                var delay;

                if (!attributes.connections) {
                  return html`<div class="not-found-station">
                    Station not found.
                  </div>`;
                }

                return html` <div class="connection">
                  <div class="connection-datetime">
                    <span class="connection-time">
                      ${attributes?.departure_time}
                    </span>
                    <span class="connection-date">DD.MM</span>
                  </div>
                  ${attributes.connections?.map((connection) => {
                    return html` <div class="single-connection-wrapper">
                      <div class="connection-type-num-wrapper">
                        <span
                          class="connection-type-num ${connection.type === "Bus"
                            ? "connection-type-bus"
                            : connection.type === "Tram"
                            ? "connection-type-tram"
                            : "connection-type-else"}"
                        >
                          <img />
                          <span class="connection-type"
                            >${connection.type}</span
                          >
                          <span class="connection-num"
                            >${connection.number}</span
                          >
                        </span>
                        ${(delay = connection.delay)
                          ? html`<span class="connection-delay">${delay}</span>`
                          : ""}
                      </div>
                      <ul class="single-connection-list">
                        <li class="single-connection-item">
                          <span class="time">${connection.times[0]}</span>
                          <span>${connection.stations[0]}</span>
                          <span>${connection.platforms[0]}</span>
                        </li>
                        <li class="single-connection-item">
                          <span class="time">${connection.times[1]}</span>
                          <span>${connection.stations[1]}</span>
                          <span>${connection.platforms[1]}</span>
                        </li>
                      </ul>
                    </div>`;
                  })}
                  <hr />
                </div>`;
              })}
          <div class="page-more-button"></div>

          <ha-icon
            class="page-more-button-icon"
            .icon=${this.hass.states[this.config.button]?.attributes?.icon}
          ></ha-icon>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      .card-content {
        --card-background-color-darken: rgb(
          from var(--card-background-color) calc(r * 0.85) calc(g * 0.85)
            calc(b * 0.85)
        );
        margin: 0em;
        padding: 1.5em 0 0;
        border-radius: var(--ha-card-border-radius, 12px);
        border-width: var(--ha-card-border-width, 1px);
      }

      .card-content hr {
        border-bottom-width: 0px;
        border-color: var(
          --ha-card-border-color,
          var(--divider-color, #e0e0e0)
        );
        margin: 7px 0 0;
      }

      .card-content hui-entity-card {
        --ha-card-border-width: 0;
      }

      .station-selection-wrapper {
        padding: 0 2.5%;
      }

      .station-selection {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 2.5%;
      }

      .connection,
      .station-selection-wrapper {
        margin: 0 2.5%;
      }

      .connnection {
        padding: 0 0 0 0;
      }

      .connection > * {
        padding: 0 0 0 7px;
      }

      .connection-datetime {
        padding: 7px;
        background-color: var(--card-background-color-darken);
      }

      .connection-date {
        font-size: 10px;
      }

      .connection-delay {
        background: rgba(13, 89, 32, 0.5);
        padding: 0 3px;
        margin: 0;
        float: right;
        font-size: 12px;
        border-radius: 2px;
      }

      .single-connection-wrapper {
        margin: 0.5em 0 0 0;
      }

      .connection-type-num-wrapper {
      }

      .connection-type-num {
      }

      .connection-type-num.connection-type-bus {
        color: #1940b3;
      }

      .connection-type-num.connection-type-tram {
        color: rgb(134, 19, 19);
      }

      .connection-type-num.connection-type-else {
        color: green;
      }

      .single-connection-list {
        list-style: none;
        margin-top: 0em;
        margin-bottom: 0em;
        padding-left: 20px;
      }

      .single-connection-item {
      }

      .time:before {
        content: "";
        display: inline-block;
        border-radius: 50%;
        background: var(--state-icon-color);
        width: 6px;
        height: 6px;
        margin-right: 10px;
        vertical-align: middle;
      }

      .page-more-button-icon {
        color: var(--state-icon-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 80px;
        justify-content: center;
      }
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define list of 'entities'");
    } else if (!config.button) {
      throw new Error("You need to define 'button' entity");
    } else if (!config.text_departure_entity) {
      throw new Error("You need to define 'text_departure_entity' entity");
    } else if (!config.text_arrival_entity) {
      throw new Error("You need to define 'text_arrival_entity' entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }

  #_showError(error) {
    const errorCard = document.createElement("hui-error-card");
    errorCard.setConfig({
      type: "error",
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;

    // These are equivalent:
    // var err = {
    //   type: "error",
    //   error: "error",
    //   origConfig: this.config,
    // };

    // return html`<hui-error-card ._config=${err}></hui-error-card>`;
  }
}

customElements.define("idos-card", IDOSCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "idos-card",
  name: "IDOS Card",
  preview: false, // Optional - defaults to false
  description:
    "A custom card to display public transport connections from IDOS public transport integration", // Optional
});
