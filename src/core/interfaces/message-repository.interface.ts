import { FileEntity } from '../entities/file.entity';
import { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository {
  get(messageId: string): Promise<MessageEntity>;
  update(messageId: string, data: UpdateMessageData): Promise<MessageEntity>;
  addFiles(userId: string, fileNames: FileData[]): Promise<FileEntity[]>;
  getFile(fileId: string): Promise<FileEntity>;
}

export interface UpdateMessageData {
  text?: string;
  files?: string[];
}

export interface FileData {
  name: string;
  path: string;
}
