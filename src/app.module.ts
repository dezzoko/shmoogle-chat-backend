import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import authConfig from './config/auth.config';
import mongooseConfig from './config/mongoose.config';
import redisConfig from './config/redis.config';
import config from './config';
import { AppMongooseModule } from './mongoose/mongoose.module';
import { ModulesModule } from './modules/modules.module';
import { ThrottlerModule } from '@nestjs/throttler/dist/throttler.module';
import { redisStore } from 'cache-manager-redis-yet';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      load: [config, authConfig, mongooseConfig, redisConfig],
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        limit: configService.get<number>('throttler.limit'),
        ttl: configService.get<number>('throttler.ttl'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: await redisStore({
          url: `redis://:@${configService.get<string>(
            'redis.host',
          )}:${configService.get<number>('redis.port')}/0`,
          ttl: 4000,
        }),
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),

    ModulesModule,
    AppMongooseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
