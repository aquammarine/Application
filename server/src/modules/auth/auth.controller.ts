import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RtAuthGuard } from '../../common/guards/rt-auth.guard';
import * as express from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: express.Request) {
        const user = (req as any).user;
        return this.authService.logout(user.id);
    }

    @Post('refresh')
    @UseGuards(RtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: express.Request) {
        const user = (req as any).user;
        return this.authService.updateRefreshToken(user.id, user.refreshToken);
    }
}
