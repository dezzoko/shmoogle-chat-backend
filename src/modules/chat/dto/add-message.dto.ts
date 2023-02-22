import { IsOptional } from 'class-validator';

export class AddMessageDto {
  chatId: string;
  text: string;
  creatorId: string;

  @IsOptional()
  isResponseToId?: string;
}
