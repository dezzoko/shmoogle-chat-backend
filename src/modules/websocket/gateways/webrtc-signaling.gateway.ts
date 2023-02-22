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

// TODO: add proper origin and port (use config files)
@WebSocketGateway(8080, { namespace: 'signal', cors: { origin: '*' } })
export class WebRTCSignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private webRTCSignalingService: WebRTCSignalingService) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.webRTCSignalingService.initializeSocket(client);
  }

  handleDisconnect(client: Socket) {
    this.webRTCSignalingService.disconnectSocket(client);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.REQUEST)
  async request(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    this.webRTCSignalingService.request(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.CALL)
  async call(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    this.webRTCSignalingService.call(socket, data);
  }

  @SubscribeMessage(WebRTCSignalingServerEvents.END)
  async end(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    this.webRTCSignalingService.end(socket, data);
  }
}
