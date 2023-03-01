import { Module } from '@nestjs/common';

import { ChatModule } from '../chat/chat.module';
import { ConferenceRoomModule } from '../conference-room/conference-room.module';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';
import { WebRTCSignalingGateway } from './gateways/webrtc-signaling.gateway';
import { WebRTCSignalingService } from './services/webrtc-signaling.service';

@Module({
  imports: [UserModule, ChatModule, ConferenceRoomModule],
  providers: [ChatGateway, WebRTCSignalingGateway, WebRTCSignalingService],
  exports: [],
})
export class AppWebsocketModule {}
