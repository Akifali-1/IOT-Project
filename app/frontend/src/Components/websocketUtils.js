// websocketUtils.js
let socket = null;
const subscribers = [];

const getDefaultWebSocketUrl = () => {
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }

    if (typeof window !== 'undefined' && window.location) {
        const { protocol, host } = window.location;
        const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProtocol}//${host}`;
    }

    return 'ws://localhost:5001';
};

export const initializeWebSocket = (url = getDefaultWebSocketUrl()) => {
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
            const retryUrl = url;
            socket = null;
            setTimeout(() => initializeWebSocket(retryUrl), 5000); // Auto-reconnect
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

