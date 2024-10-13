import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "../../entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { UploadFilesMiddleware } from "../../middleware/uploadFiles.middleware";
import { CloudinaryModule } from "../../base/cloudinary/cloudinary.module";
import { LoggerModule } from "../../base/logger/logger.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, User]),
        CloudinaryModule,
        LoggerModule
    ],
    controllers: [ProductController],
    providers: [ProductService]
})

export class ProductModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(UploadFilesMiddleware)  // Áp dụng middleware
        .forRoutes(
            { path: 'products/create', method: RequestMethod.POST },
            { path: 'products/edit/:id', method: RequestMethod.PATCH }
        ); 
    }
}