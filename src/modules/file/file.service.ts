import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { createReadStream } from 'fs';

export enum FileType {
  AVATARS = 'avatars',
  CHAT = 'chat',
}

@Injectable()
export class FileService {
  createFile(file): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve('assets', 'avatars');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getFile(filePath: string) {
    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }

  removeFile(fileName: string) {
    const filePath = path.resolve('assets', 'avatars', fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
