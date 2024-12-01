import { useState, useEffect, useCallback } from 'react';

const useWebSocket = (restaurantId) => {
  const [ws, setWs] = useState(null);
  const [hasNewReservations, setHasNewReservations] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    console.log(process.env.REACT_APP_WS_URL);
    const wsUrl = `ws://localhost:4000/ws`;
    const newWs = new WebSocket(wsUrl);

    newWs.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      if (restaurantId) {
        newWs.send(JSON.stringify({
          type: 'subscribe',
          restaurantId: restaurantId
        }));
      }
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'newReservation' && data.restaurantId === restaurantId) {
          setHasNewReservations(true);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    newWs.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect();
      }, 3000);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      newWs.close();
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, [restaurantId]);

  useEffect(() => {
    connect();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connect]);

  const resetNotification = () => {
    setHasNewReservations(false);
  };

  return { hasNewReservations, resetNotification, isConnected };
};

export default useWebSocket;