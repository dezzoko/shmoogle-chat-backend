import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WebRTCSignalingClientEvents } from 'src/common/constants/events';
import { RtcCallDto } from '../dto/rtc-call.dto';

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
      console.log('on request no remote was found with id ', data.to);
      return;
    }
    console.log(
      'emitting request from ',
      clientSocket.id,
      ' to ',
      requestedClientSocket.id,
    );
    requestedClientSocket.emit(WebRTCSignalingClientEvents.REQUEST, {
      from: clientSocket.id,
    });
  }

  async call(clientSocket: Socket, data: RtcCallDto) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) {
      console.log('on call no client found with id ', data.to);
      return;
    }
    console.log(
      'Emitting call from',
      clientSocket.id,
      ' to ',
      requestedClientSocket.id,
      ' with data ',
      data,
    );
    requestedClientSocket.emit(WebRTCSignalingClientEvents.CALL, {
      ...data,
      from: clientSocket.id,
    });
  }

  async end(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) {
      console.log('on end no client was found with id ', data.to);
      return;
    }
    console.log(
      'Emitting end from ',
      clientSocket.id,
      ' to ',
      requestedClientSocket.id,
      ' with data',
      data,
    );
    requestedClientSocket.emit(WebRTCSignalingClientEvents.END);
  }

  async disconnectSocket(clientSocket: Socket) {
    console.log(
      'disconnecting (deleting from map) socket with id ',
      clientSocket.id,
    );
    this.clients.delete(clientSocket.id);
  }
}
