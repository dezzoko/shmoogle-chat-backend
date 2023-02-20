import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/modules/user/services/user.service';
import { SignupDto } from '../dto/signup.dto';
import { comparePassword } from 'src/common/utils/bcrypt';
import { LoginDto } from '../dto/login.dto';
import { GoogleUser } from '../strategies/google-oauth2.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(id: string) {
    try {
      const user = await this.userService.get(id);
      return user;
    } catch (error) {
      return null;
    }
  }

  async signup(signupDto: SignupDto) {
    if (await this.userService.getByLogin(signupDto.login)) {
      throw new BadRequestException('User with such login already exists');
    }

    return await this.userService.registerUser(signupDto);
  }

  async loginGoogleAuth(user: GoogleUser) {
    if (!user || !user.email || !user.name) {
      throw new BadRequestException('not authenticated');
    }

    let found = await this.userService.getByLogin(user.email);

    if (!found) {
      // TODO: generate random password for google user
      found = await this.signup({
        login: user.email,
        password: user.email,
        confirmPassword: user.email,
        username: user.name,
      });
    }

    const payload = {
      userId: found.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.configService.get<string>('auth.expiresIn'),
    };
  }

  async login(user: LoginDto) {
    const found = await this.userService.getByLogin(user.login);

    if (found?.login != user.login) {
      throw new BadRequestException('Login or password is incorrect');
    }
    if (!comparePassword(user.password, found.password)) {
      throw new BadRequestException('Login or password is incorrect');
    }

    const payload = { userId: found.id };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.configService.get<string>('auth.expiresIn'),
    };
  }
}
