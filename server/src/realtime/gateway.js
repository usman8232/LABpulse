import { Server } from 'socket.io';

import { env } from '../config/env.js';

export class RealtimeGateway {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: env.CLIENT_URL,
        credentials: true,
      },
    });
  }

  broadcastDeviceUpdate(device) {
    this.io.emit('device:update', device);
  }

  broadcastAlert(alert) {
    this.io.emit('alert:update', alert);
  }
}
