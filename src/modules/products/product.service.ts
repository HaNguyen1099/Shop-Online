import { Injectable, NotFoundException } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../../entities/product.entity";
import { FindManyOptions, ILike, Repository } from "typeorm";
import { ProductDto } from "../../dto/product.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    async getProducts(page: number, limit: number, sortKey: string, sortValue: string, keyword: string): Promise<Product[]> {
        const skip = (page - 1) * limit

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
                { title: ILike(`%${trimmedKeyword}%`) }, // Tìm kiếm trong title
            ];
        }

        return await this.productsRepository.find(find);

    }

    async createProduct(productDto: ProductDto): Promise<Product> {
        const newProduct = this.productsRepository.create(productDto);
        return this.productsRepository.save(newProduct);
    }

    async detailProduct(id: number): Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        return product
    }

    async updateProduct(id: number, productDto: ProductDto): Promise<Product | null>{
        const product = await this.productsRepository.preload({
            id,
            ...productDto,
        });

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        return this.productsRepository.save(product);
    }

    async deleteProduct(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }
}

