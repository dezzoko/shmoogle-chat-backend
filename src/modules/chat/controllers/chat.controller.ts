import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InviteUserDto } from '../dto/invite-user.dto';
import { ChatService } from '../services/chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id/messages')
  async getMessages(@Param('id') chatId: string, @Req() req: any) {
    return this.chatService.getMessages(chatId, req.user.id);
  }

  @Post('inviteUser')
  async inviteUser(@Body() inviteUserDto: InviteUserDto, @Req() req) {
    return this.chatService.inviteUser(
      req.user.id,
      inviteUserDto.userLogin,
      inviteUserDto.chatId,
    );
  }
}
