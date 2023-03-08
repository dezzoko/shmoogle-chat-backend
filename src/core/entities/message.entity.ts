import { FileEntity } from './file.entity';

export class MessageEntity {
  constructor(
    public id: string,
    public text: string,
    public creatorId: string,
    public chatId: string,
    public createdAt: Date,
    public hasModified: boolean,
    public isResponseToId?: string,
    public files?: FileEntity[],
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

    return new MessageEntity(
      object.id || object._id,
      object.text,
      object.creatorId,
      object.chatId,
      object.createdAt || new Date(),
      object.hasModified || false,
      object.isResponseToId || null,
      files,
    );
  }
}
