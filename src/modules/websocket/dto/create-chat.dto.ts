import { IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @MinLength(3)
  @MaxLength(50)
  name: string;

  creatorId: string;
  users: string[];

  @IsBoolean()
  isGroup: boolean;
}
