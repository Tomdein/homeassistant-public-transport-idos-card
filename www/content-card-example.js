import "https://unpkg.com/wired-card@0.8.1/wired-card.js?module";
import "https://unpkg.com/wired-toggle@0.8.0/wired-toggle.js?module";
import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

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
              <span class="connection-delay">
                ${(delay = attributes.connections[0].delay) ? delay : ""}
              </span>
              ${attributes.connections.map((connection) => {
                return html` <div
                    class="connection-type-num ${connection.type === "Bus"
                      ? "connection-type-bus"
                      : connection.type === "Tram"
                      ? "connection-type-tram"
                      : "connection-type-else"}"
                  >
                    <img />
                    <span class="connection-type">${connection.type}</span>
                    <span class="connection-num">${connection.number}</span>
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
        padding: 1.5em 0em;
        border-radius: 1em;
      }

      .connection {
        margin: 0em 0em 1em 0em;
        padding: 0em 1.5em;
      }

      .connection-datetime {
      }

      .connection-date {
        font-size: 10px;
      }

      .connection-delay {
        background: green;
      }

      .connection-type-num {
      }

      .connection-type-num.connection-type-bus {
        color: blue;
      }

      .connection-type-num.connection-type-tram {
        color: red;
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

      .time:before {
        content: "";
        display: inline-block;
        border-radius: 50%;
        background: var(--state-icon-color);
        width: 10px;
        height: 10px;
        margin-right: 5px;
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
