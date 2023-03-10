import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { CHAT_REPOSITORY } from 'src/common/constants/tokens';
import { IChatRepository } from 'src/core/interfaces/chat-repository.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { AddMessageDto } from '../dto/add-message.dto';
import { CreateChatDto } from '../dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private chatRepository: IChatRepository,
    private userService: UserService,
  ) {}

  async getUserChats(userId: string) {
    return this.chatRepository.getByUserId(userId);
  }

  async get(chatId: string) {
    return this.chatRepository.get(chatId);
  }

  async inviteUser(userId: string, userLogin: string, chatId?: string) {
    const user = await this.userService.getByLogin(userLogin);
    if (!user || user.id === userId) {
      throw new BadRequestException('No such user');
    }

    if (chatId) {
      return await this.chatRepository.addUserToChat(chatId, user.id);
    }

    const existingChats = await this.chatRepository.getByUserId(userId);

    if (existingChats.find((chat) => chat.name === user.id + userId)) {
      throw new BadRequestException('Already have chat with this user');
    }

    return await this.chatRepository.create({
      creatorId: userId,
      name: user.id + userId,
      isGroup: false,
      users: [user.id],
    });
  }

  async getMessages(chatId: string, userId: string) {
    return this.chatRepository.getMessages(chatId, userId);
  }

  async addMessage(id: string, message: AddMessageDto) {
    return this.chatRepository.addMessage(id, message);
  }

  async create(chat: CreateChatDto) {
    return this.chatRepository.create(chat);
  }

  async addUserToChat(chatId: string, userId: string) {
    return this.chatRepository.addUserToChat(chatId, userId);
  }
}
