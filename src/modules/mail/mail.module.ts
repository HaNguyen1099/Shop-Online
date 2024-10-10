import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { BullModule } from "@nestjs/bullmq";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";
import { MailService } from "./mail.service";
import { MailProcessor } from "./processors/mail.processor";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, User]), 
        ScheduleModule.forRoot(),
        BullModule.registerQueue({
            name: 'sendMail',
        }),
    ],
    providers: [MailService, MailProcessor]
})

export class MailModule {};