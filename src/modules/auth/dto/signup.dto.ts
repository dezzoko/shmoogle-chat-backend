import { ApiProperty, ApiBody } from '@nestjs/swagger';
import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class SignupDto {
  @MinLength(8)
  @MaxLength(60)
  @IsEmail()
  login: string;

  @MinLength(8)
  @MaxLength(30)
  @IsStrongPassword()
  password: string;

  @MinLength(8)
  @MaxLength(30)
  @Match('password')
  confirmPassword: string;

  @MinLength(3)
  @MaxLength(40)
  username: string;
}
