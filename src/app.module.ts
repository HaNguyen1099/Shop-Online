import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Nguyenha2003',
      database: 'shop-online',
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
