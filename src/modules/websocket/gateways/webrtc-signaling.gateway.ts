import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebRTCSignalingServerEvents } from 'src/common/constants/events';
import { WebRTCSignalingService } from '../services/webrtc-signaling.service';
import { Socket, Server } from 'socket.io';
import { RtcCallDto } from '../dto/rtc-call.dto';
import { RtcRequestDto } from '../dto/rtc-request.dto';
import { RtcEndDto } from '../dto/rtc-end.dto';
import { RtcJoinRoomDto } from '../dto/rtc-join-room.dto';

// TODO: add proper origin and port (use config files)
@WebSocketGateway(8080, { namespace: 'signal', cors: { origin: '*' } })
export class WebRTCSignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private webRTCSignalingService: WebRTCSignalingService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.webRTCSignalingService.initializeSocket(client);
  }

  handleDisconnect(client: Socket) {
    this.webRTCSignalingService.disconnectSocket(client, this.server);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.INITIALIZATION)
  async initialization(@ConnectedSocket() socket: Socket) {
    this.webRTCSignalingService.initializeSocket(socket);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.REQUEST)
  async request(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: RtcRequestDto,
  ) {
    this.webRTCSignalingService.request(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.CALL)
  async call(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: RtcCallDto,
  ) {
    this.webRTCSignalingService.call(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.END)
  async end(@ConnectedSocket() socket: Socket, @MessageBody() data: RtcEndDto) {
    this.webRTCSignalingService.end(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: RtcJoinRoomDto,
  ) {
    this.webRTCSignalingService.joinRoom(socket, this.server, data);
  }
}
