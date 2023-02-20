import { IGenericRepository } from '../abstracts/generic-repository.abstract';
import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';

export interface IChatRepository extends IGenericRepository<ChatEntity> {
  getByUserId(id: string): Promise<ChatEntity[]>;
  create(item: any, creatorId: string): Promise<ChatEntity>;
  addMessage(chatId: string, message: AddMessageData): Promise<MessageEntity>;
}

export interface AddMessageData {
  text: string;
  creatorId: string;
  isResponseToId: string;
}
