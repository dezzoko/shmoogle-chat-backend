import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { IUserRepository } from 'src/core/interfaces/user-repository.interface';
import { SignupDto } from 'src/modules/auth/dto/signup.dto';
import { FileService } from 'src/modules/file/file.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password-dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private fileService: FileService,
  ) {}

  async get(id: string) {
    const user = await this.userRepository.get(id);

    if (!user) {
      throw new NotFoundException('no such user');
    }

    return user;
  }

  async getAll() {
    return await this.userRepository.getAll();
  }

  async getByLogin(login: string) {
    return await this.userRepository.getByLogin(login);
  }

  async getKnownUsers(userId: string) {
    const user = await this.userRepository.get(userId);

    if (!user) {
      throw new BadRequestException('no such user');
    }

    return await this.userRepository.getKnownUsers(userId);
  }

  async registerUser(dto: SignupDto) {
    return await this.userRepository.registerUser(dto);
  }

  async create(dto: CreateUserDto) {
    //do unique login check
    try {
      const createdUser = await this.userRepository.create(dto);
      return createdUser;
    } catch (error) {
      throw new BadRequestException('Cannot create user', error.message);
    }
  }

  async update(dto: UpdateUserDto, userId: string, avatarFile: string) {
    try {
      const avatarUrl = this.fileService.createFile(avatarFile);
      const user = await this.userRepository.get(userId);
      this.fileService.removeFile(user.avatarUrl);
      const updatedUser = await this.userRepository.update(userId, {
        ...dto,
        avatarUrl,
      });
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Cannot update user', error.message);
    }
  }

  async updatePassword(dto: UpdatePasswordDto, userId: string) {
    try {
      const updatedUser = await this.userRepository.updatePassword(userId, dto);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Cannot update password', error.message);
    }
  }
}
