import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

export class ChatEntity {
  constructor(
    public id: string,
    public name: string,
    public creatorId: string,
    public users: UserEntity[],
    public messages: MessageEntity[],
    public isGroup: boolean,
  ) {}

  static fromObject(object: any) {
    if (
      ((!object.id && !object._id) || !object.name || !object.creatorId) ??
      (!object.isGroup || !object.users.length)
    ) {
      throw new Error('cannot create ChatEntity from object');
    }

    return new ChatEntity(
      object.id || object._id,
      object.name,
      object.creatorId,
      object.users,
      object.messages || [],
      object.isGroup || false,
    );
  }
}
