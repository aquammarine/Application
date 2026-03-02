import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            ...payload,
            refreshToken,
        };
    }
}
