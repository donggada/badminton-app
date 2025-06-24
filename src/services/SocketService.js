import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.listeners = new Map();
  }

  connect(roomId) {
    if (this.socket) {
      this.disconnect();
    }

    this.roomId = roomId;
    this.socket = io(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:8080', {
      query: { roomId }
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('roomUpdate', (data) => {
      const listeners = this.listeners.get('roomUpdate') || [];
      listeners.forEach(callback => callback(data));
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.roomId = null;
      this.listeners.clear();
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService(); 