import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chat } from './chat.schema';
import { File } from './file.schema';
import { User } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creatorId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
  chatId: Chat;

  @Prop()
  createdAt: Date;

  @Prop()
  hasModified: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: false,
  })
  isResponseToId: Message;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
    required: false,
  })
  files?: File[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
