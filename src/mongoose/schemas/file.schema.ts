import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Message } from './message.schema';
import { User } from './user.schema';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop()
  name: string;

  @Prop()
  path: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: false,
  })
  message?: Message;
}

export const FileSchema = SchemaFactory.createForClass(File);
