import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import * as Minio from 'minio';
@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private static readonly BUCKET_NAME = 'shmoogle';

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
    const bucketExists = await this.minioClient.bucketExists(
      MinioService.BUCKET_NAME,
    );
    if (!bucketExists) {
      await this.minioClient.makeBucket(MinioService.BUCKET_NAME, 'us-east-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = uuid.v4() + '.' + fileExtension;
    await this.minioClient.putObject(
      MinioService.BUCKET_NAME,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }
  //
  async getFile(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      MinioService.BUCKET_NAME,
      fileName,
    );
  }

  async downloadFile(fileName: string) {
    const fileURL = await this.minioClient.getObject(
      MinioService.BUCKET_NAME,
      fileName,
    );

    return new StreamableFile(fileURL);
  }
}
