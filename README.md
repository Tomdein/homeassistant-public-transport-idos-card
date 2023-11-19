This is Lovelace UI card for Home Assistant created specialy for custom integration `public-transport-idos`.

This card shows all the information about Czech public transport connections scraped from [idos.cz](https://idos.idnes.cz/vlakyautobusymhdvse/spojeni/) as well as enabling to change destination and arrival stations. (With hinting of the station names)

Example of "idos card" yaml config:
```yaml
type: custom:idos-card
entities:
  - sensor.idos_public_transport_sensor1
  - sensor.idos_public_transport_sensor2
  - sensor.idos_public_transport_sensor3
button: button.idos_public_transport_page_more
text_departure_entity: text.idos_public_transport_departure_input
text_arrival_entity: text.idos_public_transport_arrival_input
```