import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebRTCSignalingServerEvents } from 'src/common/constants/events';
import { WebRTCSignalingService } from '../services/webrtc-signaling.service';
import { Socket } from 'socket.io';
import { RtcCallDto } from '../dto/rtc-call.dto';
import { RtcRequestDto } from '../dto/rtc-request.dto';
import { RtcEndDto } from '../dto/rtc-end.dto';

// TODO: add proper origin and port (use config files)
@WebSocketGateway(8080, { namespace: 'signal', cors: { origin: '*' } })
export class WebRTCSignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private webRTCSignalingService: WebRTCSignalingService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('initializing socket with id', client.id);
    this.webRTCSignalingService.initializeSocket(client);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnecting socket with id', client.id);
    this.webRTCSignalingService.disconnectSocket(client);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.REQUEST)
  async request(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: RtcRequestDto,
  ) {
    console.log('REQUEST from id', socket.id, ' to ', data.to);
    this.webRTCSignalingService.request(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.CALL)
  async call(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: RtcCallDto,
  ) {
    console.log(
      'CALL from id',
      socket.id,
      ' to ',
      data.to,
      data.sdp || data.candidate || 'no anything',
    );
    this.webRTCSignalingService.call(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.END)
  async end(@ConnectedSocket() socket: Socket, @MessageBody() data: RtcEndDto) {
    console.log('END from id', socket.id, ' to ', data.to);
    this.webRTCSignalingService.end(socket, data);
  }
}
