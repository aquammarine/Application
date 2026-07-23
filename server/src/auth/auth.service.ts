import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new NotFoundException("User doesn't exist");
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException("Invalid password");
        }

        const tokens = await this.generateTokens(user.id, user.email);

        return {
            tokens
        };
    }

    async register(dto: RegisterDto) {

        const user = await this.usersService.findByEmail(dto.email);

        if (user) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);

        const newUser = await this.usersService.create({...dto, password: hashedPassword});

        const tokens = await this.generateTokens(newUser.id, newUser.email);

        return {
            tokens
        };
    }

    async generateTokens(id: string, email: string) {
        const accessToken = await this.jwtService.signAsync(
            { sub: id, email },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m'
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { sub: id, email },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            },
        );

        return { accessToken, refreshToken }
    }

    async logout(userId: string) {
        // TO BE IMPLEMENTED
    }

    async refreshTokens(rt: string) {
        //TO BE IMPLEMENTED
    }
}
