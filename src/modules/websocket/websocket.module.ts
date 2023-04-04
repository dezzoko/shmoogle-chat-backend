import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

import { ChatModule } from '../chat/chat.module';
import { ConferenceRoomModule } from '../conference-room/conference-room.module';
import { MessageModule } from '../message/message.module';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';
import { WebRTCSignalingGateway } from './gateways/webrtc-signaling.gateway';
import { ChatWebsocketService } from './services/chat-websocket.service';
import { WebRTCSignalingService } from './services/webrtc-signaling.service';

@Module({
  imports: [
    UserModule,
    ChatModule,
    ConferenceRoomModule,
    AuthModule,
    MessageModule,
  ],
  providers: [
    ChatGateway,
    WebRTCSignalingGateway,
    WebRTCSignalingService,
    ChatWebsocketService,
  ],
  exports: [],
})
export class AppWebsocketModule {}
