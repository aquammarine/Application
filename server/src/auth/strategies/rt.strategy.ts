import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req?.cookies as Record<string, string> | undefined)?.refresh_token ??
          null,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; email: string; jti: string }) {
    const refreshToken = (req.cookies as Record<string, string> | undefined)
      ?.refresh_token;

    if (!refreshToken) throw new ForbiddenException('Refresh token missing');

    return {
      ...payload,
      refreshToken,
    };
  }
}
