import { IGenericRepository } from '../abstracts/generic-repository.abstract';
import { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository extends IGenericRepository<MessageEntity> {
  getByChatId(id: string): Promise<MessageEntity[]>;
  addMessage(chatId: string, message: AddMessageData): Promise<MessageEntity>;
}

interface AddMessageData {
  text: string;
  creatorId: string;
  isResponseToId: string;
}
