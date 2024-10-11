import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configSystem } from '../config/system.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API for NestJS project')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Bật transform để class-transformer hoạt động
  }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configSystem.PORT);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
