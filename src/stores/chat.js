import { defineStore } from 'pinia';
import io from 'socket.io-client';

export const useChatStore = defineStore('chat', {
  state: () => ({
    socket: null,
    messages: [],
    users: [],
  }),

  actions: {
    connect(userId) {
      if (this.socket) return;
      // Connect to the socket server
      this.socket = io('http://localhost:3000'); // Your server URL

      this.socket.on('connect', () => {
        console.log('Connected to socket server with id:', this.socket.id);
        // Join a room based on user ID
        this.socket.emit('join', userId);
      });

      this.socket.on('receive_message', (message) => {
        this.messages.push(message);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        this.socket = null;
      });
    },

    sendMessage({ conversationId, senderId, content }) {
      if (!this.socket) {
        console.error('Socket not connected');
        return;
      }
      const message = { conversationId, senderId, content };
      this.socket.emit('send_message', message);
      // Optionally, add the message to the state immediately for a better UX
      this.messages.push({ ...message, sender_name: 'You' }); 
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  },
});
