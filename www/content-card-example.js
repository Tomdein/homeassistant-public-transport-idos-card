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
    var attributes;
    var delay;
    var connection;

    return html` <div class="card-content">
      ${this.config.entities.map((ent) => {
        const stateObj = this.hass.states[ent];
        return stateObj
          ? ((attributes = stateObj.attributes),
            (connection = attributes.connections[0]),
            html`
              <div class="connection">
                <div class="connection-datetime">
                  <span class="connection-time"
                    >${attributes.departure_time}</span
                  >
                  <span class="connection-date">DD.MM</span>
                </div>
                <span class="connection-delay"
                  >${(delay = connection.delay) ? delay : ""}</span
                >
                <div class="connection-type-num">
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
                </ul>
                <hr />
              </div>
            `)
          : html` <div class="not-found">Entity ${ent} not found.</div> `;
      })}
    </div>`;
  }

  static get styles() {
    return css`
      .card-content {
        background: darkgrey;
      }

      .connection-datetime {
        background: grey;
      }

      .connection-date {
        font-size: 10px;
      }

      .connection-delay {
        background: green;
      }

      .connection-type-num {
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
        background: black;
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
