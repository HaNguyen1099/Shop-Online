import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { User } from '../../entities/user.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Role } from '../../base/enums/role.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    
    constructor(
        @InjectQueue('sendMail') private mailQueue: Queue,

        @InjectRepository(Product)
        private productsRepository: Repository<Product>,

        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async sendMail(to: string[], subject: string, template: string, context: any) {
        await this.mailQueue.add('sendMail', {
            to,
            subject,
            template,
            context,
        })
    }

    async notify() {
        const stock = await this.productsRepository.find({
            where: { 
                quantity: LessThanOrEqual(10)
            }
        })

        if (stock.length > 0) {
            const admin = await this.getAdmin();

            for (const user of admin) {
                await this.sendMail(
                    [user.email],
                    "Nhắc nhở nhập hàng",
                    "./notify",
                    {
                        name: user.name,
                        products: stock
                    }
                )
            }
        }
    }

    private async getAdmin() {
        return await this.usersRepository.find({
            where: { role: Role.ADMIN }, 
        });
    }

    @Cron('0 18 * * 6') // Thay đổi thời gian nếu cần
    async handleCron() {
        this.logger.log('Checking stock levels...');
        await this.notify();
    }
}
