import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configSystem } from "../../../../config/system.config";
import { AuthService } from "../auth.service";

@Injectable()
// Xác thực người dùng, kết nối với Guards
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            ignoreExpiration: false, 
            secretOrKey: configSystem.JWTSecret, 
        });
    }

    async validate(payload: {sub: number}) {
        const id = payload.sub;
        const user = await this.authService.validateJwtUser(id);
        return user;
    }
}