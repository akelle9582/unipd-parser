import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: require("url").parse(process.env.REDISTOGO_URL).hostname,
    port: require("url").parse(process.env.REDISTOGO_URL).port,
    auth_pass: require("url").parse(process.env.REDISTOGO_URL).auth.split(":")[1],
    ttl: 150
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}