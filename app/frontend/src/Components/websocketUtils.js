// websocketUtils.js
let socket = null;
const subscribers = [];

export const initializeWebSocket = (url = 'ws://localhost:5001') => {
    if (!socket) {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Notify all subscribers with the received message
            subscribers.forEach((callback) => callback(data));
        };

        socket.onclose = () => {
            console.warn('WebSocket connection closed. Reconnecting...');
            setTimeout(() => initializeWebSocket(url), 5000); // Auto-reconnect
        };
    }
    return socket;
};

export const subscribeToMessages = (callback) => {
    if (typeof callback === 'function') {
        subscribers.push(callback);
    }
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        // console.log('Sending WebSocket message:', message); // Add logging for debugging
        socket.send(JSON.stringify(message));

    } else {
        console.warn('WebSocket is not open. Unable to send message:', message);
    }
};

