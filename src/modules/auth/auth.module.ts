import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { JWTStrategy } from './passport/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from "../users/user.module";
import { JwtModule } from "@nestjs/jwt";
import { configSystem } from "../../../config/system.config";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        UserModule,
        JwtModule.register({
            secret: configSystem.JWTKey,
            signOptions: {
              expiresIn: '1d'
            }
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy],
    exports: [AuthService]
})
export class AuthModule {}