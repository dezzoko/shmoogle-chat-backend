export class ConferenceRoomEntity {
  constructor(
    public id: string,
    public joinToken: string,
    public creator: string,
  ) {}

  static fromObject(object: any) {
    if ((!object.id && !object._id) || !object.joinToken || !object.creator) {
      throw new Error('cannot create ConferenceRoomEntity from object');
    }

    return new ConferenceRoomEntity(
      object.id || object._id,
      object.joinToken,
      object.creator,
    );
  }
}
