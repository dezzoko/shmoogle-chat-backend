import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AppWebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [UserModule, ChatModule, AuthModule, AppWebsocketModule],
  providers: [],
  exports: [UserModule, ChatModule, AuthModule, AppWebsocketModule],
})
export class ModulesModule {}
