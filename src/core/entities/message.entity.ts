import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

export class MessageEntity {
  constructor(
    public id: string,
    public text: string,
    public creatorId: UserEntity,
    public chatId: string,
    public createdAt: Date,
    public hasModified: boolean,
    public isResponseToId?: string,
    public responses?: MessageEntity,
    public files?: FileEntity[],
    public likes?: { userId: string; value: string },
  ) {}

  static fromObject(object: any) {
    if (
      (!object.id && !object._id) ||
      !object.text ||
      !object.creatorId ||
      !object.chatId
    ) {
      throw new Error('cannot create MessageEntity from object');
    }
    let files;
    if (object.files && object.files?.length > 0) {
      files = object.files.map((file) => FileEntity.fromObject(file));
    }

    let responses;
    if (object.responses && object.responses.length && !object.isResponseToId) {
      responses = object.responses.map((message) =>
        MessageEntity.fromObject(message),
      );
    }
    let user;
    if (object.creatorId.login) {
      user = UserEntity.fromObject(object.creatorId);
    }

    return new MessageEntity(
      object.id || object._id,
      object.text,
      user || object.creatorId,
      object.chatId,
      object.createdAt || new Date(),
      object.hasModified || false,
      object.isResponseToId || null,
      responses || [],
      files || [],
      object.likes || [],
    );
  }
}
