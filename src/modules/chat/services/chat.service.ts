import { Injectable, NotImplementedException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { CHAT_REPOSITORY } from 'src/common/constants/tokens';
import { IChatRepository } from 'src/core/interfaces/chat-repository.interface';
import { AddMessageDto } from '../dto/add-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private chatRepository: IChatRepository,
  ) {}

  async getUserChats(userId: string) {
    return this.chatRepository.getByUserId(userId);
  }

  async get(chatId: string) {
    return this.chatRepository.get(chatId);
  }

  async addMessage(id: string, message: AddMessageDto) {
    return this.chatRepository.addMessage(id, message);
  }

  async createChat() {
    throw new NotImplementedException('not implemented');
  }
}
