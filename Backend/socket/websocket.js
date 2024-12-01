const WebSocket = require('ws');
const Reservation = require('../model/reservationmodel');

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server , path: '/ws'});

  wss.on('connection', async (ws) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe' && data.restaurantId) {
          ws.restaurantId = data.restaurantId;
          
          const hasUnviewedReservations = await Reservation.exists({
            restaurantId: data.restaurantId,
            viewed: false
          });

          if (hasUnviewedReservations) {
            ws.send(JSON.stringify({
              type: 'newReservation',
              restaurantId: data.restaurantId
            }));
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
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