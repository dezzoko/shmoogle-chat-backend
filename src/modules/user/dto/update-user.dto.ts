import { MinLength, MaxLength, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UpdateUserDto {
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  username?: string;

  @MinLength(8)
  @MaxLength(30)
  @IsOptional()
  password?: string;

  @MinLength(8)
  @MaxLength(30)
  @IsOptional()
  newPassword?: string;
  @IsOptional()
  @IsIn([1, 2, 3])
  statusId?: number;

  @IsOptional()
  avatarUrl: string;
}
