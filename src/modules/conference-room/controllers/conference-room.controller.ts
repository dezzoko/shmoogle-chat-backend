import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConferenceRoomService } from '../services/conference-room.service';

@ApiTags('conference-room')
@Controller('conference-room')
export class ConferenceRoomController {
  constructor(private conferenceRoomService: ConferenceRoomService) {}

  @Get('new')
  async createNewRoom(@Req() req: any) {
    return this.conferenceRoomService.createNewRoom(req.user.id);
  }

  @Get()
  async getRoomsByUserId(@Req() req: any) {
    return this.conferenceRoomService.getRoomsByUserId(req.user.id);
  }

  @Get(':joinToken')
  async getRoomByJoinToken(@Param('joinToken') joinToken: string) {
    return this.conferenceRoomService.getByJoinToken(joinToken);
  }
}
