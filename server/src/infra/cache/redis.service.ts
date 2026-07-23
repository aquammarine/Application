import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { OnModuleDestroy } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error('REDIS_URL not set');
    super(url);

    const logger = new Logger();

    this.on('connect', () => logger.log('Redis connected'));
    this.on('error', (err) => logger.error('Redis error', err));
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
