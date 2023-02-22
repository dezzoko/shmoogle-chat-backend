import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import {
  ChatClientEvents,
  ChatServerEvents,
} from 'src/common/constants/events';
import { ChatEntity } from 'src/core/entities/chat.entity';
import { AddMessageDto } from 'src/modules/chat/dto/add-message.dto';
import { CreateChatDto } from 'src/modules/chat/dto/create-chat.dto';
import { ChatService } from 'src/modules/chat/services/chat.service';
import { UserService } from 'src/modules/user/services/user.service';
import { InviteToChatDto } from '../dto/invite-to-chat.dto';

// TODO: add check auth token in handleConnection, move logic into service
@WebSocketGateway(8080, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    // console.log('Socket.io:: connected client with id ' + client.id);
    // console.log('args is ', ...args);
    // //client.disconnect(true);
    // //throw new Error('Method not implemented.')
  }

  @SubscribeMessage(ChatServerEvents.GET_AND_SUBSCRIBE_CHATS)
  async getChats(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<ChatEntity[]>> {
    try {
      const user = await this.userService.get(userId);

      if (!user) {
        throw new WsException('Cannot find user with such id');
      }

      const chats = await this.chatService.getUserChats(user.id);

      for (const chat of chats) {
        client.join(chat.id);
      }

      return { event: ChatClientEvents.NEW_CHATS, data: chats };
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error.message };
    }
  }

  @SubscribeMessage(ChatServerEvents.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() addMessageDto: AddMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.userService.get(addMessageDto.creatorId);
      if (!user) {
        throw new WsException('Cannot find user with such id');
      }

      const chat = await this.chatService.get(addMessageDto.chatId);

      if (
        !chat ||
        chat.users.find((user) => user.id === addMessageDto.creatorId)
      ) {
        throw new WsException(
          'No such chat or user is not member of such chat',
        );
      }

      const newMessage = await this.chatService.addMessage(
        addMessageDto.chatId,
        addMessageDto,
      );

      this.server
        .to(addMessageDto.chatId)
        .emit(ChatClientEvents.NEW_MESSAGE, addMessageDto.chatId, newMessage);
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error.message };
    }
  }

  @SubscribeMessage(ChatServerEvents.CREATE_CHAT)
  async createChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.userService.get(createChatDto.creatorId);

      if (!user) {
        throw new WsException('no such user');
      }

      const createdChat = await this.chatService.create(createChatDto);
      const chats = await this.chatService.getUserChats(
        createChatDto.creatorId,
      );

      // TODO: notify connected users (create map for connected users)

      client.join(createdChat.id);

      return { event: ChatClientEvents.NEW_CHATS, data: chats };
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error };
    }
  }

  @SubscribeMessage(ChatServerEvents.INVITE_TO_CHAT)
  async inviteToChat(
    @MessageBody() inviteToChatDto: InviteToChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { invitedLogin, inviterId, chatId } = inviteToChatDto;

      const user = await this.userService.get(inviterId);

      if (!user) {
        throw new WsException('no such user');
      }

      const invitedUser = await this.userService.getByLogin(invitedLogin);

      if (!invitedUser) {
        throw new WsException('cannot find user with such login');
      }

      const chat = await this.chatService.get(chatId);
      if (!chat || chat.creatorId !== inviterId) {
        throw new WsException(
          'no such chat or you are not manager of this chat',
        );
      }

      const updatedChat = await this.chatService.addUserToChat(
        chatId,
        invitedUser.id,
      );
      // TODO: Add chat events entities
      this.server
        .to(updatedChat.id)
        .emit(ChatClientEvents.NEW_CHAT_EVENT, 'ff');
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error };
    }
  }

  @SubscribeMessage('message')
  async message(@MessageBody() msg: string, @ConnectedSocket() client: Socket) {
    console.log('accepted message: ', msg);
    client.emit('message', msg);

    return msg;
  }
}
