import { MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  login: string;

  @MinLength(8)
  @MaxLength(30)
  password: string;
}
