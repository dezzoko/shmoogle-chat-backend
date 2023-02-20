import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { Req, Res } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { GoogleOAuth2Guard } from 'src/common/guards/google-oauth.guard';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '../services/auth.service';
import { GoogleUser } from '../strategies/google-oauth2.strategy';

@ApiTags('auth')
@NoAuth()
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @UseGuards(GoogleOAuth2Guard)
  @Get('/google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async google() {}

  @UseGuards(GoogleOAuth2Guard)
  @Get('/google-callback')
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = req.user as GoogleUser;

    return await this.authService.loginGoogleAuth(user);
  }
}
