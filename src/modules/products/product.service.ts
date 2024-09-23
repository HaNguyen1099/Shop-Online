import { ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import { BaseService } from "../../base/service/basicService";
import { ProductDto } from "../../dto/product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, ILike, Repository } from "typeorm";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
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

        return super.actionPreCreate(productDto)
    }

    async actionPostCreate(record: Product){
        return record
    }

    async create(productDto: ProductDto): Promise<Product> {
        return super.create(productDto);
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

    async actionPostList(record: Product[]){
        return record;
    }

    async getList(optionDto: OptionDto): Promise<Product[]> {
        return super.getList(optionDto);
    }

    async actionPreDetail(id: number){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return super.actionPreDetail(id)
    }

    async actionPostDetail(record: Product){
        return record;
    }

    async getDetail(id: number): Promise<Product> {
        return super.getDetail(id);
    }

    async actionPreUpdate(id: number, productDto: ProductDto){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return super.actionPreUpdate(id, productDto)
    }

    async actionPostUpdate(record: Product){
        return record;
    }

    async update(id: number, productDto: ProductDto): Promise<Product> {
        return super.update(id, productDto);
    }

    async actionPreDelete(id: number){
        const countProduct = await this.productsRepository.count({
            where: { id }
        });

        if (countProduct < 1) {
            throw new NotFoundException(`Product không tồn tại!`);
        }

        return super.actionPreDelete(id)
    }

    async delete(id: number) {
        return super.delete(id);
    }
}

