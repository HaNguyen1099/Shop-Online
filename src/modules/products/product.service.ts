import { ConflictException, Injectable, Logger, NotFoundException} from "@nestjs/common";
import { BaseService } from "../../base/service/base.service";
import { ProductDto } from "../../dto/product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, ILike, Repository, LessThanOrEqual } from "typeorm";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";
import { User } from "../../entities/user.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { Role } from "../../enums/role.enum";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ProductService extends BaseService<Product> {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,

        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private readonly mailerService: MailerService
    ){
        super(productsRepository);
    }

    async actionPreCreate<T>(productDto: T & ProductDto){
        const { title, ...rest } = productDto

        const countProduct = await this.productsRepository.count({
            where: { title }
        });

        if (countProduct > 0) {
            throw new ConflictException(`Product ${title} đã tồn tại!`);
        }

        return productDto;
    }

    async actionPreList(optionDto: OptionDto){
        const page = optionDto.page || 1; 
        const limit = optionDto.limit || 5; 
        const sortKey = optionDto.sortKey; 
        const sortValue = optionDto.sortValue; 
        const keyword = optionDto.keyword; 
        const skip = (page - 1) * limit;

        const find: FindManyOptions<Product> = {
            skip: skip,
            take: limit,
        }

        if (sortKey && sortValue) {
            find.order = {
                [sortKey]: sortValue
            };
        }

        if (keyword) {
            const trimmedKeyword = keyword.trim();

            find.where = [
                { title: ILike(`%${trimmedKeyword}%`) }
            ];
        }
        return find;
    }

    async actionPreDetail(id: number){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return id;
    }

    async actionPreUpdate(id: number, productDto: ProductDto){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return productDto;
    }

    async actionPreDelete(id: number){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return id;
    }

    private async sendMail(to: string[], subject: string, template: string, context: any) {
        await this.mailerService.sendMail({
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

