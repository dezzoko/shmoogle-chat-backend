import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ConferenceRoomDocument = HydratedDocument<ConferenceRoom>;

@Schema()
export class ConferenceRoom {
  @Prop()
  joinToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;
}

export const ConferenceRoomSchema =
  SchemaFactory.createForClass(ConferenceRoom);

ConferenceRoomSchema.index({ estimateDate: 1 }, { expires: '24h' });
