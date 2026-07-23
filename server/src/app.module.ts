import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { AssistantModule } from './assistant/assistant.module';
import { RedisModule } from './infra/cache/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventsModule,
    AuthModule,
    UsersModule,
    TagsModule,
    AssistantModule,
    RedisModule,
  ],
})
export class AppModule {}
