const WebSocket = require('ws');

const Reservation = require('../model/reservationmodel');


let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server , path: '/ws'});

  wss.on('connection', async (ws) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'subscribe':
            if (data.restaurantId) {
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
            break;

          case 'reservationUpdated':
          case 'reservationCancelled':
            notifyRestaurantOwner(data.restaurantId, data.type);
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);

      }
    });
  });
};

const notifyRestaurantOwner = (restaurantId, type) => {
  wss.clients.forEach((client) => {
    if (client.restaurantId === restaurantId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type,
        restaurantId
      }));
    }
  });
};

module.exports = { initializeWebSocket, notifyRestaurantOwner };