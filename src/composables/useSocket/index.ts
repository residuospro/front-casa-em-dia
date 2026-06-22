import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket() {
  const conectar = () => {
    if (socket?.connected) return socket;

    const token = JSON.parse(localStorage.getItem('token') || 'null');

    if (!token) return null;

    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return socket;
  };

  const desconectar = () => {
    socket?.disconnect();
    socket = null;
  };

  const getSocket = () => socket;

  return { conectar, desconectar, getSocket };
}
