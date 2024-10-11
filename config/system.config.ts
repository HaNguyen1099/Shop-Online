import * as dotenv from "dotenv";

dotenv.config();

export class Config {
    // Port
    PORT = +process.env.PORT || 3000;

    // Postgresql
    postgresHost = process.env.POSTGRES_HOST;
    postgresPort = +process.env.POSTGRES_PORT
    postgresUser = process.env.POSTGRES_USER
    postgresPassword = process.env.POSTGRES_PASSWORD
    postgresDatabase = process.env.POSTGRES_DATABASE

    // JWT 
    JWTSecret = process.env.JWT_SECRET
    JWTExpire = process.env.JWT_EXPIRE_IN

    // REFRESH JWT 
    RefreshJWTSecret = process.env.REFRESH_JWT_SECRET
    RefreshJWTExpire = process.env.REFRESH_JWT_EXPIRE_IN

    // EMAIL
    MailHost = process.env.MAIL_HOST
    MailUser = process.env.MAIL_USER
    MailPassword = process.env.MAIL_PASSWORD
    MailFrom = process.env.MAIL_FROM
    MailTransport = process.env.MAIL_TRANSPORT

    // Redis
    RedisHost = process.env.REDIS_HOST
    RedisPort = +process.env.REDIS_PORT

    // Cloudinary
    CloudName = process.env.CLOUD_NAME
    CloudKey = process.env.CLOUD_KEY
    CloudSecret = process.env.CLOUD_SECRET
}

export const configSystem = new Config();