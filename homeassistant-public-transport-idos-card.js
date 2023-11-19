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
      button_clicked: false,
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

    var departure_station =
      this.hass.states[this.config.text_departure_entity]?.state;
    var arrival_station =
      this.hass.states[this.config.text_arrival_entity]?.state;

    return html`
      <ha-card>
        <div class="card-content">
          <div class="station-selection-wrapper">
            <span class="station-selection">
              <div class="station-selection-single-wrapper">
                <div
                  class="station-selection-single"
                  @mousedown=${{
                    handleEvent: (e) =>
                      this.station_mousedown_event("station-from"),
                    capture: true, // Needed to trigger before focus when clicking on input
                  }}
                  @click=${{
                    handleEvent: (e) =>
                      this.station_click_event("station-from"),
                  }}
                >
                  <span class="station-selection-header">From</span>
                  <input
                    tabindex="1"
                    id="station-from"
                    class="station-selection-input"
                    value=${departure_station}
                    @focus=${{
                      handleEvent: (e) => this.station_focus_event(e),
                      capture: true,
                    }}
                    @blur=${{
                      handleEvent: (e) => this.station_blur_event(e),
                      capture: true,
                    }}
                    @input=${{
                      handleEvent: (e) => this.station_input_event(e),
                      capture: true,
                    }}
                  />
                  <div class="hints-menu-wrapper">
                    <div class="hints-menu">
                      ${[...Array(5).keys()].map(() => {
                        return html`
                          <span
                            class="hint"
                            @mousedown=${{
                              handleEvent: (e) =>
                                this.station_hint_clicked(e, "station-from"),
                              capture: true,
                            }}
                            >Item 1</span
                          >
                        `;
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div class="station-selection-single-wrapper">
                <div
                  class="station-selection-single"
                  @mousedown=${{
                    handleEvent: (e) =>
                      this.station_mousedown_event("station-to"),
                    capture: true, // Needed to trigger before focus when clicking on input
                  }}
                  @click=${{
                    handleEvent: (e) => this.station_click_event("station-to"),
                  }}
                >
                  <span class="station-selection-header">To</span>
                  <input
                    tabindex="2"
                    id="station-to"
                    class="station-selection-input"
                    value=${arrival_station}
                    @focus=${{
                      handleEvent: (e) => this.station_focus_event(e),
                      capture: true,
                    }}
                    @blur=${{
                      handleEvent: (e) => this.station_blur_event(e),
                      capture: true,
                    }}
                    @input=${{
                      handleEvent: (e) => this.station_input_event(e),
                      capture: true,
                    }}
                  />
                  <div class="hints-menu-wrapper">
                    <div class="hints-menu">
                      ${[...Array(5).keys()].map(() => {
                        return html`
                          <span
                            class="hint"
                            @mousedown=${{
                              handleEvent: (e) =>
                                this.station_hint_clicked(e, "station-to"),
                              capture: true,
                            }}
                            >Item 1</span
                          >
                        `;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
          ${!this.config
            ? html` ${this.#_showWarning("Config not set in this card")} `
            : this.config.entities.map((ent) => {
                const stateObj = this.hass.states[ent];

                if (!stateObj) {
                  return html`
                    <div class="connection">
                      ${this.#_showWarning("Unknown entity '" + ent + "'")}
                    </div>
                  `;
                }

                var attributes = stateObj.attributes;
                var delay;

                if (!attributes.connections) {
                  return html` <div class="connection">
                    ${this.#_showWarning("Station not found")}
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
      :host {
        font-family: var(--paper-font-body1_-_font-family);
      }

      .card-content {
        --card-background-color-darken: rgb(
          from var(--card-background-color) calc(r * 0.85) calc(g * 0.85)
            calc(b * 0.85)
        );
        --card-background-color-lighten: rgb(
          from var(--card-background-color) calc(r * 1.15) calc(g * 1.15)
            calc(b * 1.15)
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

      .station-selection-single-wrapper {
        padding: 8px 16px 16px;
        position: relative;
      }

      .station-selection-single {
        padding: 1px; /* Fixes 1px input cursor blinking on borders*/
        line-height: 28px;
        display: flex;
        flex-direction: column;
      }

      .station-selection-single:hover {
        cursor: pointer;
      }

      .station-selection-header {
        color: var(--secondary-text-color);
        font-size: 16px;
        font-weight: 500;
      }

      .station-selection-input {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 28px;
        font-family: inherit;
        color: var(--primary-text-color);
        background-color: inherit;
        /* background-color: var(--card-background-color-darken); */
        border: unset;
        cursor: inherit;
      }

      .station-selection-input:focus {
        outline: none;
      }

      .station-selection-input:focus + .hints-menu-wrapper {
        display: block;
      }

      .hints-menu-wrapper {
        display: none;
        position: relative;
      }

      .hints-menu {
        position: absolute;
        z-index: 10;
        box-sizing: border-box;
        width: 100%;
        background: var(--card-background-color-darken);
      }

      .hint {
        padding: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .hint:hover {
        background-color: var(--card-background-color-lighten);
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

  station_mousedown_event(input_id_to_focus) {
    var input_element = this.shadowRoot.getElementById(input_id_to_focus);
    // Create a new 'change' event
    var event = new Event("input");
    // Dispatch it.
    input_element.dispatchEvent(event);
  }

  // Focuses the input element by id
  station_click_event(input_id_to_focus) {
    var input_element = this.shadowRoot.getElementById(input_id_to_focus);
    input_element.focus();
    input_element.select();
  }

  // Show/hide hints (and fire hass value changed on focus out)
  station_focus_event(event) {
    this.button_clicked = "focus: " + event.target.value;
  }

  // Update text_entity in hass once we loose focus
  station_blur_event(event, text_entity_in_hass) {
    this.button_clicked = "blur: " + event.target.value;
  }

  // Update hints when text changes
  station_input_event(event, station_type) {
    var input_element = event.target;
    var hints = input_element.parentElement.querySelectorAll(".hint");

    // Hide hints while querying data
    hints.forEach((hint) => {
      hint.style.display = "none";
    });

    this.hass.connection
      .sendMessagePromise({
        type: "idos/search_stations",
        station: input_element.value,
        count: "10",
      })
      .then(
        (resp) => {
          hints.forEach((hint, index) => {
            if (index < resp.stations?.length) {
              hint.textContent = resp.stations[index];
              hint.style.display = "block";
            } else {
              hint.textContent = "";
              hint.style.display = "none";
            }
          });
        },
        (err) => {
          console.error("Message failed!", err);
        }
      );
  }

  station_hint_clicked(event, input_id_to_update) {
    this.shadowRoot.getElementById(input_id_to_update).value =
      event.target.textContent;

    var text_entity_id;
    if (input_id_to_update === "station-from") {
      text_entity_id = this.config.text_departure_entity;
    } else if (input_id_to_update === "station-to") {
      text_entity_id = this.config.text_arrival_entity;
    }

    if (text_entity_id) {
      this.hass.callService("text", "set_value", {
        value: event.target.textContent,
        entity_id: text_entity_id,
      });
    }
  }

  #_showWarning(warning) {
    return html` <hui-warning>${warning}</hui-warning> `;
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
