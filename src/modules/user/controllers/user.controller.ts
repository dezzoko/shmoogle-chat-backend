import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';

import { UserService } from '../services/user.service';

//TODO: add interceptor to delete password property from result
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Get('')
  async getAll() {
    return this.userService.getAll();
  }

  @Post('')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
