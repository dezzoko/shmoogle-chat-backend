import { Injectable } from '@nestjs/common/decorators';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GenericUpdateData } from 'src/core/abstracts/generic-repository.abstract';
import { ChatEntity } from 'src/core/entities/chat.entity';
import { MessageEntity } from 'src/core/entities/message.entity';
import {
  AddMessageData,
  CreateChatData,
  IChatRepository,
  LikeData,
} from 'src/core/interfaces/chat-repository.interface';
import { Chat, ChatDocument } from 'src/mongoose/schemas/chat.schema';
import { File, FileDocument } from 'src/mongoose/schemas/file.schema';
import { Message, MessageDocument } from 'src/mongoose/schemas/message.schema';
import { User, UserDocument } from 'src/mongoose/schemas/user.schema';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectConnection() private mongooseConnection: mongoose.Connection,
  ) {}

  async getByUserId(id: string): Promise<ChatEntity[]> {
    const chats = await this.chatModel
      .find({
        users: { $all: [id] },
      })
      .populate('users')
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

  async addLike(likeData: LikeData): Promise<LikeData> {
    const likedMessage = await this.messageModel.findById(likeData.messageId);

    if (!likedMessage) {
      throw new Error('no such message');
    }
    likedMessage.likes.push(likeData);
    await likedMessage.save();

    return likeData;
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
        path: ' ',
        populate: {
          path: 'creatorId',
          model: 'User',
        },
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'files',
          model: 'File',
        },
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'responses',
          populate: { path: 'creatorId', model: 'User' },
          model: 'Message',
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
      const populated = await createdChat.populate('users');
      return ChatEntity.fromObject(populated);
    } catch (error) {
      throw new Error('Cannot create chat');
    }
  }

  // TODO: transaction?
  async addMessage(id: string, message: AddMessageData) {
    const chat = await this.chatModel.findById(id).exec();

    if (!chat) {
      throw new Error('no such chat');
    }

    const files = await this.fileModel
      .find({
        name: {
          $in: [...message.files],
        },
      })
      .exec();

    const createdMessage = new this.messageModel({
      ...message,
      chatId: id,
      hasModified: false,
      createdAt: new Date(),
      files: files ? files.map((file) => file._id) : undefined,
    });
    await createdMessage.save();

    if (message.isResponseToId) {
      const responseToMessage = await this.messageModel.findById(
        message.isResponseToId,
      );
      if (!responseToMessage) {
        throw new Error('no such message');
      }
      responseToMessage.responses.push(createdMessage);
      await responseToMessage.save();
    }

    files.forEach((file) => (file.message = createdMessage));
    this.fileModel.bulkSave(files);

    chat.messages.push(createdMessage);
    await chat.save();

    const populatedMessage = await this.messageModel
      .findById(createdMessage._id)
      .populate('creatorId')
      .populate('files')
      .populate('responses')
      .exec();

    return MessageEntity.fromObject(populatedMessage);
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

  async update(
    id: string,
    item: GenericUpdateData<ChatEntity>,
  ): Promise<ChatEntity> {
    const chat = await this.chatModel.findByIdAndUpdate(id, item);
    return ChatEntity.fromObject(chat);
  }

  // TODO: transaction
  async delete(id: string): Promise<boolean> {
    const chat = await this.chatModel.findById(id);

    if (!chat) {
      throw new Error('no such chat');
    }

    const session = await this.mongooseConnection.startSession();
    session.startTransaction();
    try {
      await this.fileModel
        .deleteMany({
          message: {
            $in: [...chat.messages],
          },
        })
        .populate('message');

      await this.messageModel.deleteMany({
        chatId: id,
      });

      await chat.remove();

      session.commitTransaction();
      return true;
    } catch (error) {
      session.abortTransaction();
      return false;
    } finally {
      session.endSession();
    }
  }
}
