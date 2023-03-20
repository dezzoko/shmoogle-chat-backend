import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  UseInterceptors,
  CacheInterceptor,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MinioService } from 'src/modules/minio/minio.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password-dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';

import { UserService } from '../services/user.service';

//TODO: add interceptor to delete password property from result
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly minioService: MinioService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get('self')
  async getSelf(@Req() req) {
    return this.userService.get(req.user.id);
  }

  @Get('self/knownUsers')
  async getSelfKnownUsers(@Req() req) {
    return this.userService.getKnownUsers(req.user.id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Put('update')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto, req.user.id);
  }

  @Put('update/password')
  async updatePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(updatePasswordDto, req.user.id);
  }

  @Put('update/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@Req() req, @UploadedFile() avatar: Express.Multer.File) {
    return await this.userService.updateAvatar(avatar, req.user.id);
  }
  // @Post('test')
  //
  // async testPoint(@UploadedFile() file: Express.Multer.File) {
  //   const fileName = await this.minioService.uploadFile(file);
  //   const fileUrl = await this.minioService.getFile(fileName);
  //   return {
  //     fileName,
  //     fileUrl,
  //   };
  // }
  @NoAuth()
  @Get('test')
  async test() {
    return await this.minioService.downloadFile(
      '1020dcc0-4008-41e9-b6f8-b6f8f17c8ce7.png',
    );
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
