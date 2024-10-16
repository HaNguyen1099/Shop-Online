import { ConflictException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { BaseService } from "../../base/service/base.service";
import { ProductDto } from "../../dto/product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, ILike, Repository } from "typeorm";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";
import { LoggerService } from "../../base/logger/logger.service";

@Injectable()
export class ProductService extends BaseService<Product> {
    protected entityName: string = "product";

    constructor(
        protected readonly logger: LoggerService,

        @InjectRepository(Product)
        private productsRepository: Repository<Product>
    ){
        super(productsRepository, logger);
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

    async uploadExcel(data: any[]) {
        const products = data.map(item => {
            const product = new Product();

            product.title = item.title;
            product.description = item.description;
            product.price = item.price;
            product.quantity = item.quantity;
            product.created_at = item.created_at;
            product.update_at = item.update_at;
            product.images = item.images;

            return product;
        })

        await this.productsRepository.save(products);
    }
}

