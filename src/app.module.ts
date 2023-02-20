import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import authConfig from './config/auth.config';
import mongooseConfig from './config/mongoose.config';
import config from './config';
import { AppMongooseModule } from './mongoose/mongoose.module';
import { ModulesModule } from './modules/modules.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [config, authConfig, mongooseConfig],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        limit: configService.get<number>('throttler.limit'),
        ttl: configService.get<number>('throttler.ttl'),
      }),
      inject: [ConfigService],
    }),
    ModulesModule,
    AppMongooseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
