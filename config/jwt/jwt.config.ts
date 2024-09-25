import { registerAs } from "@nestjs/config"
import { JwtModuleOptions } from "@nestjs/jwt"
import { configSystem } from "../system.config"

export default registerAs(
    'jwt', 
    (): JwtModuleOptions => ({
        secret: configSystem.JWTSecret,
        signOptions: {
            expiresIn: configSystem.JWTExpire
        }
    })
)