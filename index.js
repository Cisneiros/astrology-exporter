const http = require('http');
const fetch = require('node-fetch');
const prometheus = require('prom-client');

// Environment setup
const PORT = process.env.EXPORTER_PORT || 8080;

// Prometheus setup
const mercuryRetrogradeGauge = new prometheus.Gauge({ name: 'is_mercury_retrograde', help: "Reports Mercury's retrograde state. 1 if retrograde, 0 if not." });

function updateMercuryRetrograde() {
  return fetch('https://mercuryretrogradeapi.com')
    .then(res => res.json())
    .then(json => {
      const state = json.is_retrograde ? 1 : 0;
      mercuryRetrogradeGauge.set(state);
    });
}

updateMercuryRetrograde()
  .then(setInterval(() => updateMercuryRetrograde(), 30000))
  .then(() => {
    // Webserver
    console.log("Starting Astrology Exporter...");
    http.createServer(function (req, res) {
      res.write(prometheus.register.metrics());
      res.end();
    }).listen(8080);
    console.log(`Astrology exporter is running on port ${PORT}`);
  });
