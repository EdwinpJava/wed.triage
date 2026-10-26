import { Server } from 'socket.io';

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('connection:status', { ok: true, message: 'Conectado al tablero TRAMED' });

    socket.on('waiting-room:request', (payload) => {
      socket.emit('waiting-room:update', {
        ok: true,
        patients: [
          { id: 'P-1001', priority: 'Urgente', status: 'Pendiente', waitingMinutes: 12 },
          { id: 'P-1002', priority: 'Alta', status: 'En evaluación', waitingMinutes: 8 },
          { id: 'P-1003', priority: 'Normal', status: 'En espera', waitingMinutes: 15 },
        ],
        source: 'demo',
        ...payload,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`);
    });
  });

  return io;
}
