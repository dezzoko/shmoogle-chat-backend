import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { hashPasword } from 'src/common/utils/bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  statusId: number;

  @Prop()
  avatarUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//add password encrypting here
UserSchema.pre('save', async function (next) {
  this.password = await hashPasword(this.password);
  next();
});
