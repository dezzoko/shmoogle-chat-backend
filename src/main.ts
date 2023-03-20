import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { MinioService } from './modules/minio/minio.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // TODO: Add correct origin
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Shmoogle chat backend')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const minioService = app.get<MinioService>(MinioService);
  await minioService.createBucket();

  await app.listen(configService.get('port'));
}
bootstrap();
