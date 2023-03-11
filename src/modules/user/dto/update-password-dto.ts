import { MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @MinLength(8)
  @MaxLength(30)
  password: string;

  @MinLength(8)
  @MaxLength(30)
  newPassword: string;
}
