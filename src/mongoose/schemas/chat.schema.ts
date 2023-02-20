import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
import { User } from './user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  creatorId: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  })
  messages: Message[];

  @Prop({ required: true })
  isGroup: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
