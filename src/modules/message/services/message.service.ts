import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { createReadStream } from 'fs';
import { MESSAGE_REPOSITORY } from 'src/common/constants/tokens';
import { IMessageRepository } from 'src/core/interfaces/message-repository.interface';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private messageRepository: IMessageRepository,
  ) {}

  async addFiles(userId: string, files: Express.Multer.File[]) {
    const fileDatas = files.map((file) => ({
      path: file.path,
      name: file.originalname,
    }));
    return this.messageRepository.addFiles(userId, fileDatas);
  }

  async getFile(fileId: string) {
    const file = await this.messageRepository.getFile(fileId);

    if (!file) {
      throw new NotFoundException('No such file');
    }

    const fileStream = createReadStream(file.path);
    return new StreamableFile(fileStream);
  }
}
