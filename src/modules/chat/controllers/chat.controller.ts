import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id/messages')
  async getMessages(@Param('id') chatId: string, @Req() req: any) {
    return this.chatService.getMessages(chatId, req.user.id);
  }
}
