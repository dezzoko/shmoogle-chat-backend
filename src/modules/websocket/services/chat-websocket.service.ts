import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatClientEvents } from 'src/common/constants/events';
import { AddMessageDto } from '../dto/add-message.dto';
import { ChatService } from 'src/modules/chat/services/chat.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { JWT_SERVICE } from 'src/common/constants/tokens';

// TODO: test multiple connections from one user
export class ChatWebsocketService {
  constructor(
    @Inject(JWT_SERVICE) private jwtService: JwtService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  users: Map<string, Socket> = new Map();

  initializeUser(client: Socket, token: string) {
    try {
      const payload: any = this.jwtService.decode(token);

      if (payload.refresh || !payload.userId) {
        throw new WsException('Invalid token');
      }

      this.users.set(payload.userId, client);
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }

  async getChats(userId: string) {
    const client = this.users.get(userId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }
    const chats = await this.chatService.getUserChats(userId);

    for (const chat of chats) {
      client.join(chat.id);
    }

    client.emit(ChatClientEvents.NEW_CHATS, chats);
  }

  async sendMessage(addMessageDto: AddMessageDto, server: Server) {
    const { chatId, creatorId } = addMessageDto;
    const client = this.users.get(creatorId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }

    const chat = await this.chatService.get(chatId);

    if (!chat || chat.users.find((user) => user.id === creatorId)) {
      throw new WsException('No such chat or user is not member of such chat');
    }

    const newMessage = await this.chatService.addMessage(chatId, addMessageDto);

    //console.log('new message!', newMessage);

    server.to(chatId).emit(ChatClientEvents.NEW_MESSAGE, chatId, newMessage);
  }

  async createChat(createChatDto: CreateChatDto) {
    const { creatorId } = createChatDto;
    const client = this.users.get(creatorId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }
    const createdChat = await this.chatService.create(createChatDto);
    for (const member of createdChat.users) {
      const memberClient = this.users.get(member.id);
      if (memberClient) {
        memberClient.emit(ChatClientEvents.NEW_CHAT, createdChat);
        memberClient.join(createdChat.id);
      }
    }
  }

  async inviteToChat(inviteToChatDto: InviteUserDto, server: Server) {
    const { userLogin, inviterId, chatId } = inviteToChatDto;
    const client = this.users.get(inviterId);
    if (!client) {
      throw new WsException('Cannot find user with such id');
    }

    const chat = await this.chatService.inviteUser(
      inviterId,
      userLogin,
      chatId,
    );

    const invitedUser = chat.users.find((u) => u.login === userLogin)!;
    server.to(chat.id).emit(ChatClientEvents.INVITED_TO_CHAT, invitedUser);

    const invitedClient = this.users.get(invitedUser.id);
    if (invitedClient) {
      invitedClient.emit(ChatClientEvents.NEW_CHAT, chat);
    }
  }

  disconnectUser(client: Socket) {
    for (const key of this.users.keys()) {
      if (this.users.get(key).id !== client.id) continue;
      return this.users.delete(key);
    }
  }
}
