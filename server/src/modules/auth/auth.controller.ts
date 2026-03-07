import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, Res, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RtAuthGuard } from '../../common/guards/rt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import * as express from 'express';
import { ONE_MINUTE, ONE_WEEK } from '../../common/constants/time.constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    @ApiResponse({ status: 409, description: 'Email already exists.' })
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: express.Response) {
        const { user, access_token, refresh_token } = await this.authService.register(dto);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_MINUTE * 15,
        })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_WEEK,
        });
        return {
            message: 'Register successful',
            user,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
        const { user, access_token, refresh_token } = await this.authService.login(dto);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_MINUTE * 15,
        })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_WEEK,
        });
        return {
            message: 'Login successful',
            user,
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 204, description: 'User successfully logged out.' })
    async logout(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
        const user = (req as any).user;

        await this.authService.logout(user.id);

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });
    }

    @Post('refresh')
    @UseGuards(RtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
    async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
        const refreshToken = req.cookies['refresh_token'];

        if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

        const { access_token, refresh_token } = await this.authService.refreshTokens(refreshToken);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_MINUTE * 15,
        })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: ONE_WEEK,
        });

        return { message: 'Tokens successfully refreshed.' };
    }

    @Get('user')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get current user' })
    @ApiResponse({ status: 200, description: 'User successfully fetched.' })
    async getUser(@Req() req: express.Request) {
        const user = (req as express.Request).user;

        return { user };
    }
}
