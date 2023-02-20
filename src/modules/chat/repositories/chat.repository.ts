import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatEntity } from 'src/core/entities/chat.entity';
import { MessageEntity } from 'src/core/entities/message.entity';
import {
  AddMessageData,
  IChatRepository,
} from 'src/core/interfaces/chat-repository.interface';
import { Chat, ChatDocument } from 'src/mongoose/schemas/chat.schema';
import { Message, MessageDocument } from 'src/mongoose/schemas/message.schema';
import { User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { AddMessageDto } from '../dto/add-message.dto';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getByUserId(id: string): Promise<ChatEntity[]> {
    const chats = await this.chatModel
      .find({
        users: { $all: [id] },
      })
      .exec();

    return chats.map((chat) => ChatEntity.fromObject(chat));
  }

  async create(item: any, creatorId: string): Promise<ChatEntity> {
    try {
      const createdChat = new this.chatModel({ ...item, creatorId });
      await createdChat.save();
      return ChatEntity.fromObject(createdChat);
    } catch (error) {
      throw new Error('Cannot create chat');
    }
  }

  async getAll(): Promise<ChatEntity[]> {
    //throw new Error('Method not implemented.');
    const chats = await this.chatModel.find();

    return chats.map((chat) => ChatEntity.fromObject(chat));
  }

  async get(id: string): Promise<ChatEntity> {
    const chat = await this.chatModel.findById(id);

    if (!chat) {
      return null;
    }

    return ChatEntity.fromObject(chat);
  }

  async addMessage(id: string, message: AddMessageData) {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new Error('no such chat');
    }
    const createdMessage = new this.messageModel({
      ...message,
      hasModified: false,
      createdAt: new Date(),
    });
    await createdMessage.save();

    chat.messages.push(createdMessage);
    await chat.save();

    return MessageEntity.fromObject(createdMessage);
  }

  async update(id: string, item: any): Promise<ChatEntity> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
