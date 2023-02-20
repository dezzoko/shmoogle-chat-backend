export class UserEntity {
  constructor(
    public id: string,
    public username: string,
    public login: string,
    public password: string,
    public avatarUrl?: string,
  ) {}

  static fromObject(object: any) {
    if (
      (!object.id && !object._id) ||
      !object.username ||
      !object.login ||
      !object.password
    ) {
      throw new Error('cannot create UserEntity from object');
    }

    return new UserEntity(
      object.id || object._id,
      object.username,
      object.login,
      object.password,
      object.avatarUrl,
    );
  }
}
