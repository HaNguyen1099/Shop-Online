import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import refreshJwtConfig from "../../../../config/jwt/refresh-jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
// Xác thực người dùng, kết nối với Guards
export class RefreshJWTStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
    constructor(
        @Inject(refreshJwtConfig.KEY) 
        private refrshJwtConfiguration: ConfigType<typeof refreshJwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
            ignoreExpiration: false, 
            secretOrKey: refrshJwtConfiguration.secret, 
        });
    }
    async validate(payload: any) {
        return { id: payload.sub }; 
    }
}