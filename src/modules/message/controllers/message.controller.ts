import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/addFiles')
  @UseInterceptors(AnyFilesInterceptor())
  async addFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    return this.messageService.addFiles(req.user.id, files);
  }

  @Get('files/:fileId')
  async getFile(@Param('fileId') fileId: string) {
    return this.messageService.getFile(fileId);
  }
}
