import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RtAuthGuard } from '../../common/guards/rt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import * as express from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    @ApiResponse({ status: 409, description: 'Email already exists.' })
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 204, description: 'User successfully logged out.' })
    async logout(@Req() req: express.Request) {
        const user = (req as any).user;
        return await this.authService.logout(user.id);
    }

    @Post('refresh')
    @UseGuards(RtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
    async refresh(@Req() req: express.Request) {
        const user = (req as any).user;
        return await this.authService.refreshTokens(user.id, user.refreshToken);
    }
}
