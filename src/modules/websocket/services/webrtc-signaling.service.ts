import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WebRTCSignalingClientEvents } from 'src/common/constants/events';

@Injectable()
export class WebRTCSignalingService {
  clients: Map<string, Socket> = new Map();

  async initializeSocket(clientSocket: Socket) {
    this.clients.set(clientSocket.id, clientSocket);
    clientSocket.emit(WebRTCSignalingClientEvents.INITIALIZATION, {
      id: clientSocket.id,
    });
  }

  async request(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) {
      return;
    }

    requestedClientSocket.emit(WebRTCSignalingClientEvents.REQUEST, {
      from: clientSocket.id,
    });
  }

  async call(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) {
      return;
    }

    requestedClientSocket.emit(WebRTCSignalingClientEvents.CALL, {
      ...data,
      from: clientSocket.id,
    });
  }

  async end(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) {
      return;
    }

    requestedClientSocket.emit(WebRTCSignalingClientEvents.END);
  }

  async disconnectSocket(clientSocket: Socket) {
    this.clients.delete(clientSocket.id);
  }
}
