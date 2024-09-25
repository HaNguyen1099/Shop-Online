import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import dotenv from "dotenv"
import { configSystem } from '../config/system.config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

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
    ProductModule,
    AuthModule,
    UserModule,
  ]
})

export class AppModule {};
