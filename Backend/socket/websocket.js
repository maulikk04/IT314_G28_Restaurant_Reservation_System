const WebSocket = require('ws');

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server , path: '/ws'});

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'subscribe' && data.restaurantId) {
        ws.restaurantId = data.restaurantId;
      }
    });
  });
};

const notifyNewReservation = (restaurantId) => {
  wss.clients.forEach((client) => {
    if (client.restaurantId === restaurantId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'newReservation',
        restaurantId: restaurantId
      }));
    }
  });
};

module.exports = { initializeWebSocket, notifyNewReservation };