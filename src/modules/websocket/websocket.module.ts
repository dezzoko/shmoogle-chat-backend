import { Module } from '@nestjs/common';

import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [UserModule, ChatModule],
  providers: [ChatGateway],
  exports: [],
})
export class AppWebsocketModule {}
