import { Server as SocketIOServer } from 'socket.io';

declare global {
  namespace Express {
    interface Application {
      get(name: 'io'): SocketIOServer;
    }
  }
}

export {};

