import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { ChatModule } from './chat/chat.module';
import { ConferenceRoomModule } from './conference-room/conference-room.module';
import { MessageModule } from './message/message.module';
import { MinioModule } from './minio/minio.module';
import { UserModule } from './user/user.module';
import { AppWebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    UserModule,
    ChatModule,
    MessageModule,
    ConferenceRoomModule,
    AuthModule,
    AppWebsocketModule,
    MinioModule,
  ],
  exports: [
    UserModule,
    ChatModule,
    MessageModule,
    ConferenceRoomModule,
    AuthModule,
    AppWebsocketModule,
    MinioModule,
  ],
})
export class ModulesModule {}
//
//
