import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


import dotenv from "dotenv"
import { configSystem } from '../config/system.config';

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
    ProductModule
  ]
})

export class AppModule {
  constructor(private dataSource: DataSource) {}
};
