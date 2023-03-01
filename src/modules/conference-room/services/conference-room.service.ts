import {
  BadRequestException,
  NotFoundException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CONFERENCE_REPOSITORY } from 'src/common/constants/tokens';
import { IConferenceRoomRepository } from 'src/core/interfaces/conference-room-repository.interface';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class ConferenceRoomService {
  constructor(
    @Inject(CONFERENCE_REPOSITORY)
    private conferenceRoomRepository: IConferenceRoomRepository,
    private userService: UserService,
  ) {}

  async createNewRoom(userId: string) {
    const user = await this.userService.get(userId);

    if (!user) {
      throw new BadRequestException('no such user');
    }

    const conferenceRooms =
      await this.conferenceRoomRepository.getRoomsByUserId(userId);

    if (conferenceRooms.length > 10) {
      throw new BadRequestException('No more rooms allowed');
    }

    return this.conferenceRoomRepository.createNewRoom(userId);
  }

  async getRoomsByUserId(userId: string) {
    return this.conferenceRoomRepository.getRoomsByUserId(userId);
  }

  async getByJoinToken(joinToken: string) {
    const room = await this.conferenceRoomRepository.getByJoinToken(joinToken);
    if (!room) {
      throw new NotFoundException('No such room');
    }

    return room;
  }
}
