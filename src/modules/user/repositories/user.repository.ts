import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { STATUS_CODES } from 'http';
import { Model } from 'mongoose';
import { comparePassword, hashPasword } from 'src/common/utils/bcrypt';

import { UserEntity } from 'src/core/entities/user.entity';
import { IUserRepository } from 'src/core/interfaces/user-repository.interface';
import { SignupDto } from 'src/modules/auth/dto/signup.dto';
import { Chat, ChatDocument } from 'src/mongoose/schemas/chat.schema';
import { User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { UpdatePasswordDto } from '../dto/update-password-dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();

    return users.map((user) => UserEntity.fromObject(user));
  }

  async get(id: string): Promise<UserEntity> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        return null;
      }
      return UserEntity.fromObject(user);
    } catch (error) {
      throw new Error('Cannot find user');
    }
  }

  async getKnownUsers(userId: string): Promise<UserEntity[]> {
    const chats = await this.chatModel
      .find(
        {
          users: {
            $all: [userId],
          },
        },
        { users: 1 },
      )
      .populate('users')
      .exec();

    const knownUsers = [];
    chats.forEach((chat) => knownUsers.push(...chat.users));

    return Array.from(new Set(knownUsers)).map((u) => UserEntity.fromObject(u));
  }

  async registerUser(signupDto: SignupDto) {
    try {
      const registeredUser = new this.userModel(signupDto);
      await registeredUser.save();
      return UserEntity.fromObject(registeredUser);
    } catch (error) {
      //console.log('cannot create user because', error.message);
      throw new Error('Cannot create user');
    }
  }

  async create(item: any): Promise<UserEntity> {
    const createdUser = new this.userModel(item);
    await createdUser.save();
    return UserEntity.fromObject(createdUser);
  }

  async getByLogin(login: string): Promise<UserEntity> {
    const user = await this.userModel.findOne({ login: login });

    if (!user) {
      return null;
    }

    return UserEntity.fromObject(user);
  }

  async update(id: string, item: UpdateUserDto): Promise<UserEntity> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, item, {
      new: true,
    });
    if (!updatedUser) {
      throw new BadRequestException('No such user');
    }
    return UserEntity.fromObject(updatedUser);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('No such user');
    }
    const { password, newPassword } = updatePasswordDto;
    if (!comparePassword(password, user.password)) {
      throw new BadRequestException('Wrong Password');
    }
    console.log(hashPasword(newPassword));

    user.password = await hashPasword(newPassword);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return UserEntity.fromObject(updatedUser);
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException('Method not implemented.');
  }
}
