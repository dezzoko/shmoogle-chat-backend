import { Injectable, Req, UseGuards } from '@nestjs/common';
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
import { ClientEvents, ServerEvents } from 'src/common/constants/events';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChatEntity } from 'src/core/entities/chat.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { AddMessageDto } from '../dto/add-message.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatService } from '../services/chat.service';

// TODO: add check auth token in handleConnection
//@UseGuards(JwtAuthGuard)
@WebSocketGateway(81, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('Socket.io:: connected client with id ' + client.id);
    console.log('args is ', ...args);
    //client.disconnect(true);
    //throw new Error('Method not implemented.')
  }

  @SubscribeMessage(ServerEvents.GET_AND_SUBSCRIBE_CHATS)
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

      return { event: ClientEvents.NEW_CHATS, data: chats };
    } catch (error) {
      return { event: ClientEvents.ERROR, data: error.message };
    }
  }

  @SubscribeMessage(ServerEvents.SEND_MESSAGE)
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
        .emit(ClientEvents.NEW_MESSAGE, newMessage);
    } catch (error) {
      return { event: ClientEvents.ERROR, data: error.message };
    }
  }

  // @SubscribeMessage(ServerEvents.CREATE_CHAT)
  // async createChat(
  //   @MessageBody() createChatDto: CreateChatDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const user = await this.userService.get(createChatDto.creatorId);

  //   if (!user) {
  //     throw new WsException('no such user');
  //   }

  //   //const chat = await this.chatService.
  //   return { event: ClientEvents.NEW_CHATS, data: '' };
  // }

  @SubscribeMessage('message')
  async message(@MessageBody() msg: string, @ConnectedSocket() client: Socket) {
    console.log('accepted message: ', msg);
    client.emit('message', msg);

    return msg;
  }
}
