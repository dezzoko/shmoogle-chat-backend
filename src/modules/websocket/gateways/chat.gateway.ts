import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { AddMessageDto } from '../dto/add-message.dto';
import { CreateChatDto } from '../dto/create-chat.dto';
import { ChatService } from 'src/modules/chat/services/chat.service';
import { UserService } from 'src/modules/user/services/user.service';
import { InviteToChatDto } from '../dto/invite-to-chat.dto';
import { ChatWebsocketService } from '../services/chat-websocket.service';
import { InviteUserDto } from '../dto/invite-user.dto';
import { SendLikeDto } from '../dto/send-like.dto';
import { MessageService } from 'src/modules/message/services/message.service';
import { DeleteLikeDto } from '../dto/delete-like-dto';

// TODO: add check auth token in handleConnection, move logic into service
@WebSocketGateway(8080, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatWebsocketService: ChatWebsocketService,
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect();
    }
    try {
      const [, parsed] = token.split(' ');
      this.chatWebsocketService.initializeUser(client, parsed);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.chatWebsocketService.disconnectUser(client);
  }

  @SubscribeMessage(ChatServerEvents.GET_AND_SUBSCRIBE_CHATS)
  async getChats(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<ChatEntity[] | string>> {
    try {
      await this.chatWebsocketService.getChats(userId);
    } catch (error) {
      return {
        event: ChatClientEvents.ERROR,
        data: `Cannot get chats: ${error.message}`,
      };
    }
  }

  @SubscribeMessage(ChatServerEvents.SEND_MESSAGE)
  async sendMessage(
    @MessageBody() addMessageDto: AddMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatWebsocketService.sendMessage(addMessageDto, this.server);
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error.message };
    }
  }

  @SubscribeMessage(ChatServerEvents.SEND_LIKE)
  async sendLike(
    @MessageBody() sendLikeDto: SendLikeDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatWebsocketService.sendLike(sendLikeDto, this.server);
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error.message };
    }
  }

  @SubscribeMessage(ChatServerEvents.DELETE_LIKE)
  async DeleteLikeDto(
    @MessageBody() deleteLikeDto: DeleteLikeDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatWebsocketService.deleteLike(deleteLikeDto, this.server);
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
      await this.chatWebsocketService.createChat(createChatDto);
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error };
    }
  }

  @SubscribeMessage(ChatServerEvents.INVITE_TO_CHAT)
  async inviteToChat(
    @MessageBody() inviteUserDto: InviteUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatWebsocketService.inviteToChat(inviteUserDto, this.server);
    } catch (error) {
      return { event: ChatClientEvents.ERROR, data: error };
    }
  }
}
