import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException("Invalid password");
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async register(dto: RegisterDto) {
        const { email, password, firstName, lastName } = dto;

        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            ...tokens,
        };
    }

    async getTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.JWT_SECRET, expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
            ),
        ]);

        return { access_token: accessToken, refresh_token: refreshToken }
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                refreshToken: {
                    not: null,
                },
            },
            data: {
                refreshToken: null,
            },
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedRefreshToken },
        });
    }
}
