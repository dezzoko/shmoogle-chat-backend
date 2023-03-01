import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ConferenceRoomEntity } from 'src/core/entities/conference-room.entity';
import { IConferenceRoomRepository } from 'src/core/interfaces/conference-room-repository.interface';
import {
  ConferenceRoom,
  ConferenceRoomDocument,
} from 'src/mongoose/schemas/conference-room.schema';

@Injectable()
export class ConferenceRoomRepository implements IConferenceRoomRepository {
  constructor(
    @InjectModel(ConferenceRoom.name)
    private conferenceRoomModel: Model<ConferenceRoomDocument>,
  ) {}

  async createNewRoom(userId: string) {
    const conferenceRoom = new this.conferenceRoomModel({
      joinToken: uuidv4(),
      creator: userId,
    });

    await conferenceRoom.save();

    return ConferenceRoomEntity.fromObject(conferenceRoom);
  }

  async getRoomsByUserId(userId: string) {
    const conferenceRooms = await this.conferenceRoomModel.find({
      creator: userId,
    });

    return conferenceRooms.map((room) => {
      return ConferenceRoomEntity.fromObject(room);
    });
  }

  async getByJoinToken(joinToken: string) {
    const conferenceRoom = await this.conferenceRoomModel.findOne({
      joinToken,
    });

    if (!conferenceRoom) {
      return null;
    }

    return ConferenceRoomEntity.fromObject(conferenceRoom);
  }
}
