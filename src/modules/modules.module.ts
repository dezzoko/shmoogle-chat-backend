import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ChatModule, AuthModule],
  providers: [],
  exports: [UserModule, ChatModule, AuthModule],
})
export class ModulesModule {}
