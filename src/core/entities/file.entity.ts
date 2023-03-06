export class FileEntity {
  constructor(
    public id: string,
    public name: string,
    public path: string,
    public messageId?: string,
  ) {}

  static fromObject(object: any) {
    if ((!object.id && !object._id) || !object.name || !object.path) {
      throw new Error('cannot create FileEntity from object');
    }

    return new FileEntity(
      object.id || object._id,
      object.name,
      object.path,
      object.messageId,
    );
  }
}
