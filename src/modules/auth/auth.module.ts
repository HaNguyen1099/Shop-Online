import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { JWTStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from "../users/user.module";
import { JwtModule } from "@nestjs/jwt";
import { configSystem } from "../../../config/system.config";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "../../../config/jwt/jwt.config";
import refreshJwtConfig from "../../../config/jwt/refresh-jwt.config";
import { RefreshJWTStrategy } from "./strategies/refresh.strategy";
import { LoggerModule } from "../../base/logger/logger.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        UserModule,
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forFeature(refreshJwtConfig),
        LoggerModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy, RefreshJWTStrategy],
    exports: [AuthService]
})
export class AuthModule {}