import { ConferenceRoomEntity } from '../entities/conference-room.entity';

export interface IConferenceRoomRepository {
  createNewRoom(userId: string): Promise<ConferenceRoomEntity>;
  getRoomsByUserId(userId: string): Promise<ConferenceRoomEntity[]>;
  getByJoinToken(joinToken: string): Promise<ConferenceRoomEntity>;
}
