import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data: user,
      omit: { password: true },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({ omit: { password: true } });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
