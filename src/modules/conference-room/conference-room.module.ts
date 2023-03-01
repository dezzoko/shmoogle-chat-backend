import { Module } from '@nestjs/common';

import { CONFERENCE_REPOSITORY } from 'src/common/constants/tokens';
import { UserModule } from '../user/user.module';
import { ConferenceRoomController } from './controllers/conference-room.controller';
import { ConferenceRoomRepository } from './repositories/conference-room.repository';
import { ConferenceRoomService } from './services/conference-room.service';

@Module({
  controllers: [ConferenceRoomController],
  imports: [UserModule],
  providers: [
    ConferenceRoomService,
    {
      provide: CONFERENCE_REPOSITORY,
      useClass: ConferenceRoomRepository,
    },
  ],
  exports: [ConferenceRoomService],
})
export class ConferenceRoomModule {}
