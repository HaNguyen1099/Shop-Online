import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configSystem } from "../../../../config/system.config";

@Injectable()
// Xác thực người dùng, kết nối với Guards
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            ignoreExpiration: false, 
            secretOrKey: configSystem.JWTSecret, 
        });
    }
    async validate(payload: any) {
        return { id: payload.sub }; 
    }
}