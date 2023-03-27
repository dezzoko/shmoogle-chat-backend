import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { IUserRepository } from 'src/core/interfaces/user-repository.interface';
import { SignupDto } from 'src/modules/auth/dto/signup.dto';
import { BucketNames, MinioService } from 'src/modules/minio/minio.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password-dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private minioService: MinioService,
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

  async update(dto: UpdateUserDto, userId: string) {
    try {
      return await this.userRepository.update(userId, dto);
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

  async updateAvatar(avatar: Express.Multer.File, userId: string) {
    if (!avatar.mimetype.includes('image')) {
      throw new BadRequestException('Avatar must be image');
    }
    const user = await this.userRepository.get(userId);
    if (user.avatarUrl) {
      this.minioService.deleteFile(user.avatarUrl, BucketNames.avatars);
    }
    const avatarUrl = await this.minioService.uploadFile(
      avatar,
      BucketNames.avatars,
    );
    const updatedUser = await this.userRepository.updateAvatar(
      userId,
      avatarUrl,
    );
    return updatedUser;
  }
  async getAvatar(userId: string) {
    const { avatarUrl } = await this.userRepository.get(userId);
    return await this.minioService.downloadFile(avatarUrl, BucketNames.avatars);
  }
}
