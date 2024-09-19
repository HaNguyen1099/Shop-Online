import { Injectable } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../../entities/product.entity";
import { Repository } from "typeorm";
import { ProductDto } from "../../dto/product.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}

    getProducts(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async createProduct(productDto: ProductDto): Promise<Product> {
        const newProduct = this.productsRepository.create(productDto);
        return this.productsRepository.save(newProduct);
    }

    detailProduct(id: number): Promise<Product | null> {
        return this.productsRepository.findOneBy({ id });
    }

    async updateProduct(id: number, productDto: ProductDto): Promise<Product | null>{
        const product = await this.productsRepository.preload({
            id,
            ...productDto,
        });
        if (!product) {
            return null;
        }
        return this.productsRepository.save(product);
    }

    async deleteProduct(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }
}