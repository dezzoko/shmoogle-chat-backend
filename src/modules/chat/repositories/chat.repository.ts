import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatEntity } from 'src/core/entities/chat.entity';
import { MessageEntity } from 'src/core/entities/message.entity';
import {
  AddMessageData,
  CreateChatData,
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

  async getAll(): Promise<ChatEntity[]> {
    //throw new Error('Method not implemented.');
    const chats = await this.chatModel.find().exec();

    return chats.map((chat) => ChatEntity.fromObject(chat));
  }

  async get(id: string): Promise<ChatEntity> {
    const chat = await this.chatModel.findById(id);

    if (!chat) {
      return null;
    }

    return ChatEntity.fromObject(chat);
  }

  async getMessages(chatId: string, userId: string): Promise<MessageEntity[]> {
    const chat = await this.chatModel
      .findOne({
        _id: chatId,
        users: {
          $all: [userId],
        },
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'creatorId',
          model: 'User',
        },
      })
      .exec();

    if (!chat) {
      throw new Error('no such chat or user not a member of this chat');
    }

    const messages = chat.messages.map((m) => MessageEntity.fromObject(m));

    return messages;
  }

  async create(item: CreateChatData): Promise<ChatEntity> {
    try {
      const user = await this.userModel.findById(item.creatorId).exec();

      if (!user) {
        throw new Error('No such user');
      }

      const members = await this.userModel
        .find({
          _id: {
            $in: item.users,
          },
        })
        .exec();

      if (members.length !== item.users.length) {
        throw new Error("Some chat member doesn't exists ");
      }

      const createdChat = new this.chatModel({
        ...item,
        users: [...item.users, user._id],
        createdAt: new Date(),
        messages: [],
      });
      await createdChat.save();
      return ChatEntity.fromObject(createdChat);
    } catch (error) {
      throw new Error('Cannot create chat');
    }
  }

  async addMessage(id: string, message: AddMessageData) {
    const user = await this.userModel.findById(message.creatorId).exec();

    if (!user) {
      throw new Error('no such user');
    }

    const chat = await this.chatModel.findById(id).exec();

    if (!chat) {
      throw new Error('no such chat');
    }

    const createdMessage = new this.messageModel({
      ...message,
      chatId: id,
      hasModified: false,
      createdAt: new Date(),
    });
    await createdMessage.save();

    chat.messages.push(createdMessage);
    await chat.save();

    const populatedCreatedMessage = await createdMessage.populate('creatorId');

    return MessageEntity.fromObject(populatedCreatedMessage);
  }

  async addUserToChat(chatId: string, userId: string): Promise<ChatEntity> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error('no such user');
    }

    const chat = await this.chatModel.findById(chatId).exec();

    if (!chat) {
      throw new Error('no such chat');
    }

    const updatedChat = await chat
      .updateOne({
        $push: {
          users: user._id,
        },
      })
      .exec();

    return ChatEntity.fromObject(updatedChat);
  }

  async update(id: string, item: any): Promise<ChatEntity> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
