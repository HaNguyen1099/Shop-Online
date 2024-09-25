import { registerAs } from "@nestjs/config"
import { JwtSignOptions } from "@nestjs/jwt"
import { configSystem } from "../system.config"

export default registerAs(
    'refresh-jwt', 
    (): JwtSignOptions => ({
        secret: configSystem.RefreshJWTSecret,
        expiresIn: configSystem.RefreshJWTExpire
    })
)