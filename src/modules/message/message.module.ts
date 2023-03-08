import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import { MESSAGE_REPOSITORY } from 'src/common/constants/tokens';
import { UserModule } from '../user/user.module';
import { MessageController } from './controllers/message.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    UserModule,
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('assetsDir'),
        preservePath: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MessageService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
  ],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
