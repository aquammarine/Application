import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        const secret = process.env.JWT_REFRESH_SECRET;

        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
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
