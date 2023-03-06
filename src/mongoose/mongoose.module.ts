import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Chat, ChatSchema } from './schemas/chat.schema';
import {
  ConferenceRoom,
  ConferenceRoomSchema,
} from './schemas/conference-room.schema';
import { File, FileSchema } from './schemas/file.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from './schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: ConferenceRoom.name, schema: ConferenceRoomSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class AppMongooseModule {}
