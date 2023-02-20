import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class LoginDto {
  login: string;

  password: string;
}
