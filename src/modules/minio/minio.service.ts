import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import * as Minio from 'minio';

export enum BucketNames {
  messages = 'messages',
  avatars = 'avatars',
}
@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  public BucketNames: BucketNames;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000, //+this.configService.get('MINIO_PORT'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: 'OH4aJ3AXdgU4q9dx', // this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: 'WIfsXzNl7MATvgnWT2Vl8ex3PPAW3Ieh', //this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  async createBucket(): Promise<void> {
    Object.keys(BucketNames).forEach(async (bucketName) => {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }
    });
  }

  async uploadFile(file: Express.Multer.File, bucketName: BucketNames) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = uuid.v4() + file.originalname + '.' + fileExtension;
    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFile(fileName: string, bucketName: BucketNames) {
    return await this.minioClient.presignedUrl('GET', bucketName, fileName);
  }

  async downloadFile(fileName: string, bucketName: BucketNames) {
    const fileURL = await this.minioClient.getObject(bucketName, fileName);

    return new StreamableFile(fileURL);
  }
}
