import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WebRTCSignalingClientEvents } from 'src/common/constants/events';
import { ConferenceRoomEntity } from 'src/core/entities/conference-room.entity';
import { ConferenceRoomService } from 'src/modules/conference-room/services/conference-room.service';
import { RtcCallDto } from '../dto/rtc-call.dto';
import { RtcJoinRoomDto } from '../dto/rtc-join-room.dto';

@Injectable()
export class WebRTCSignalingService {
  clients: Map<string, Socket> = new Map();

  constructor(private conferenceRoomService: ConferenceRoomService) {}

  async initializeSocket(clientSocket: Socket) {
    if (!this.clients.has(clientSocket.id)) {
      this.clients.set(clientSocket.id, clientSocket);
    }

    clientSocket.emit(WebRTCSignalingClientEvents.INITIALIZATION, {
      id: clientSocket.id,
    });
  }

  async request(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) return;

    requestedClientSocket.emit(WebRTCSignalingClientEvents.REQUEST, {
      from: clientSocket.id,
      user: data.user,
    });
  }

  async call(clientSocket: Socket, data: RtcCallDto) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) return;

    requestedClientSocket.emit(WebRTCSignalingClientEvents.CALL, {
      ...data,
      from: clientSocket.id,
    });
  }

  async end(clientSocket: Socket, data: any) {
    const requestedClientSocket = this.clients.get(data.to);
    if (!requestedClientSocket) return;
    requestedClientSocket.emit(WebRTCSignalingClientEvents.END, {
      from: clientSocket.id,
    });
  }

  async joinRoom(clientSocket: Socket, server: Server, data: RtcJoinRoomDto) {
    if (!this.clients.has(clientSocket.id)) return;
    let room: ConferenceRoomEntity;
    try {
      room = await this.conferenceRoomService.getByJoinToken(data.joinToken);
    } catch (error) {
      console.error(error);
      return;
    }

    if (!room) return;

    if (!clientSocket.rooms.has(data.joinToken)) {
      server.to(room.joinToken).emit(WebRTCSignalingClientEvents.NEW_MEMBER, {
        from: clientSocket.id,
        user: data.user,
      });
      clientSocket.join(room.joinToken);
    }
  }

  async disconnectSocket(clientSocket: Socket, server: Server) {
    clientSocket.rooms.forEach((room) => {
      clientSocket.leave(room);
      server
        .to(room)
        .emit(WebRTCSignalingClientEvents.END, { from: clientSocket.id });
    });
    clientSocket.disconnect();

    this.clients.delete(clientSocket.id);
  }
}
