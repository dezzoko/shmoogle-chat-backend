import { Module } from '@nestjs/common';

import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { MinioService } from '../minio/minio.service';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  imports: [],
  providers: [
    UserService,
    MinioService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
