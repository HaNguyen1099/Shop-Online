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
            secretOrKey: configSystem.JWTKey, 
        });
    }
    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email }; 
    }
}