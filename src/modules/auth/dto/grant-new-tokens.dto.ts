import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class GrantNewTokensDto {
  @IsJWT()
  refreshToken: string;
}
