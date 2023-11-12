import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
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
    return html`
      <ha-card>
        <div class="card-content">
          ${this.config.entities.map((ent) => {
            const stateObj = this.hass.states[ent];

            if (!stateObj) {
              return html`
                <div class="not-found">Entity ${ent} not found.</div>
              `;
            }

            var attributes = stateObj.attributes;
            var delay;

            return html` <div class="connection">
              <div class="connection-datetime">
                <span class="connection-time">
                  ${attributes.departure_time}
                </span>
                <span class="connection-date">DD.MM</span>
              </div>
              ${attributes.connections.map((connection) => {
                return html` <div>
                    <span
                      class="connection-type-num ${connection.type === "Bus"
                        ? "connection-type-bus"
                        : connection.type === "Tram"
                        ? "connection-type-tram"
                        : "connection-type-else"}"
                    >
                      <img />
                      <span class="connection-type">${connection.type}</span>
                      <span class="connection-num">${connection.number}</span>
                    </span>
                    ${(delay = connection.delay)
                      ? '<span class="connection-delay">' + delay + "</span>"
                      : ""}
                  </div>
                  <ul class="single-connection-list">
                    <li class="single-connection-item">
                      <span class="time">${connection.times[0]}</span>
                      <span>${connection.stations[0]}</span>
                      <span>${connection.platforms[0]}</span>
                    </li>
                    <li class="single-connection">
                      <span class="time">${connection.times[1]}</span>
                      <span>${connection.stations[1]}</span>
                      <span>${connection.platforms[1]}</span>
                    </li>
                  </ul>`;
              })}
              <hr />
            </div>`;
          })}
          <div class="page-more-button"></div>

          <ha-icon
            class="page-more-button-icon"
            .icon=${this.hass.states[this.config.button].attributes.icon}
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
        padding: 1.5em 0em 0em;
        border-radius: 1em;
      }

      .card-content hr {
        border-bottom-width: 0px;
        border-color: var(
          --ha-card-border-color,
          var(--divider-color, #e0e0e0)
        );
        margin: 7px 0px 0px;
      }

      .connection {
        margin: 0em 0em 0em 0em;
        padding: 0em 1.5em;
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
        border-radius: 5px;
        padding: 1px;
        margin: 1px;
        float: right;
        font-size: 12px;
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
      throw new Error("You need to define entities");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
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
