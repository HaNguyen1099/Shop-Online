import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CloudinaryModule } from "../../base/cloudinary/cloudinary.module";
import { LoggerModule } from "../../base/logger/logger.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        CloudinaryModule,
        LoggerModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {};