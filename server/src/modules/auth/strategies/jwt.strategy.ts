import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService
    ) {
        const secret = config.get<string>('JWT_ACCESS_SECRET');

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: secret || 'temporary-fallback-for-debug',
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) throw new UnauthorizedException('User not found');
        return user;
    }
}