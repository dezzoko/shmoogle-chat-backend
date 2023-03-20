import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOAuth2Strategy } from './strategies/google-oauth2.strategy';
import { AuthController } from './controllers/auth.controller';
import { JWT_SERVICE } from 'src/common/constants/tokens';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: JWT_SERVICE,
      useClass: JwtService,
    },
    AuthService,
    JwtStrategy,
    GoogleOAuth2Strategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [JWT_SERVICE, AuthService],
})
export class AuthModule {}
