import { Injectable } from "@nestjs/common";
import { PrismaService } from "../infra/database/prisma.service";
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(user: Prisma.UserCreateInput): Promise<User>{
        return await this.prisma.user.create({data: user});
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findFirst({ where: { email } })
    }

    async update(id: string, user: Prisma.UserUpdateInput) {
        return await this.prisma.user.update({
        where: { id },
        data: user,
        });
    }

    async remove(id: string) {
        return await this.prisma.user.delete({ where: { id } });
    }
}