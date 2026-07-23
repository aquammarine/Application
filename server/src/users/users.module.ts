import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../infra/database/prisma.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersModule]
})
export class UsersModule { }
