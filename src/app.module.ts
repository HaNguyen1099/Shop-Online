import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import dotenv from "dotenv"
import { configSystem } from '../config/system.config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configSystem.postgresHost,
      port: +configSystem.postgresPort,
      username: configSystem.postgresUser,
      password: configSystem.postgresPassword,
      database: configSystem.postgresDatabase,
      entities: [],
      autoLoadEntities: true,
      synchronize: true
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        transport: {
          host: config.get("MAIL_HOST"),
          secure: false,
          auth: {
            user: config.get("MAIL_USER"),
            pass: config.get("MAIL_PASSWORD")
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'base/email/templates'),
          adapter: new HandlebarsAdapter(),
          option: {
            strict: true,
          }
        }
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    AuthModule,
    UserModule,
  ]
})

export class AppModule {};
