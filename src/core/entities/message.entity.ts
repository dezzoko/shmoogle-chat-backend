export class MessageEntity {
  constructor(
    public id: string,
    public text: string,
    public creatorId: string,
    public createdAt: Date,
    public hasModified: boolean,
    public isResponseToId: string,
  ) {}

  static fromObject(object: any) {
    if (
      (!object.id && !object._id) ||
      !object.text ||
      !object.creatorId ||
      !object.isResponseToId
    ) {
      throw new Error('cannot create UserEntity from object');
    }

    return new MessageEntity(
      object.id || object._id,
      object.text,
      object.creatorId,
      object.createdAt || new Date(),
      object.hasModified || false,
      object.isResponseToId,
    );
  }
}
