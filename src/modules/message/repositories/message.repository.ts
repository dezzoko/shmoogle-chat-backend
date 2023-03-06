import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileEntity } from 'src/core/entities/file.entity';

import { MessageEntity } from 'src/core/entities/message.entity';
import {
  FileData,
  IMessageRepository,
  UpdateMessageData,
} from 'src/core/interfaces/message-repository.interface';
import { File, FileDocument } from 'src/mongoose/schemas/file.schema';
import { Message, MessageDocument } from 'src/mongoose/schemas/message.schema';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}
  //TODO: bulk save
  async addFiles(userId: string, fileDatas: FileData[]) {
    const files = await Promise.all(
      fileDatas.map(async (file) => {
        const backendFile = await new this.fileModel({
          name: file.name,
          path: file.path,
          user: userId,
        });
        return await backendFile.save();
      }),
    );

    return files.map((file) => FileEntity.fromObject(file));
  }

  async get(messageId: string): Promise<MessageEntity> {
    const message = await this.messageModel
      .findById(messageId)
      .populate('files')
      .exec();

    if (!message) {
      return null;
    }
    return MessageEntity.fromObject(message);
  }

  async getFile(fileId: string) {
    const file = await this.fileModel.findById(fileId).exec();
    if (!file) {
      return null;
    }

    return FileEntity.fromObject(file);
  }

  async update(
    messageId: string,
    data: UpdateMessageData,
  ): Promise<MessageEntity> {
    const message = await this.messageModel.findById(messageId).exec();

    if (!message) {
      throw new Error('No such message');
    }

    const updated = await message.update({ ...data, hasModified: true }).exec();

    return MessageEntity.fromObject(updated);
  }
}
