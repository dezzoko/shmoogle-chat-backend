import { IsEmail, IsOptional } from 'class-validator';

export class InviteUserDto {
  @IsEmail()
  userLogin: string;

  @IsOptional()
  chatId: string;
}
