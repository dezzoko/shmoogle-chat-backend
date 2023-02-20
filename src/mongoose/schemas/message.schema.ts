import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop()
  creatorId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  hasModified: boolean;

  @Prop()
  isResponseToId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
