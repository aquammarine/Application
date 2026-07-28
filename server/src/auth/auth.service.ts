import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RedisService } from 'src/infra/cache/redis.service';
import { RefreshTokenPayload } from './types/refresh-token-payload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const { password: _password, ...safeUser } = user;

    return {
      user: safeUser,
      tokens,
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      throw new BadRequestException('This email is already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const newUser = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);

    return {
      user: newUser,
      tokens,
    };
  }

  async generateTokens(id: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    const jti = crypto.randomUUID();

    const refreshToken = await this.jwtService.signAsync(
      { sub: id, email, jti },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.redisService.set(
      `refresh:${id}:${jti}`,
      hashedRefreshToken,
      'EX',
      60 * 60 * 24 * 30,
    );

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    const { sub: id, jti } =
      await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    await this.redisService.del(`refresh:${id}:${jti}`);
  }

  async refreshTokens(staleRefreshToken: RefreshTokenPayload) {
    const { sub, jti, email, refreshToken } = staleRefreshToken;
    const key = `refresh:${sub}:${jti}`;
    const storedHash = await this.redisService.get(key);

    if (!storedHash) throw new BadRequestException('Access Denied');

    const matches = await bcrypt.compare(refreshToken, storedHash);
    if (!matches) throw new BadRequestException('Access Denied');

    await this.redisService.del(key);
    return await this.generateTokens(sub, email);
  }
}
