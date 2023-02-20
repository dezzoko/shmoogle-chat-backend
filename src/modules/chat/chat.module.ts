import { Module } from '@nestjs/common';

import { CHAT_REPOSITORY } from 'src/common/constants/tokens';
import { UserModule } from '../user/user.module';
import { ChatController } from './controllers/chat.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatRepository } from './repositories/chat.repository';
import { ChatService } from './services/chat.service';

@Module({
  imports: [UserModule],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatRepository,
    },
  ],
  controllers: [ChatController],
})
export class ChatModule {}
