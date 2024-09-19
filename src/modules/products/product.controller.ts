import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductDto } from "../../dto/product.dto";
import { Product } from "../../entities/product.entity";

@ApiTags('products')
@Controller('products')

export class ProductController {
    constructor(private readonly productService: ProductService) {};

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    getProducts(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    @Post('/create')
    @ApiOperation({ summary: 'Create product' })
    async createProduct(@Body(new ValidationPipe()) productDto: ProductDto): Promise<Product>{
        return this.productService.createProduct(productDto);
    }

    @Get('/detail/:id')
    @ApiOperation({ summary: 'Get product detail' })
    detailProduct(@Param('id') id: number): Promise<Product | null> {
        return this.productService.detailProduct(id);
    }

    @Patch('/edit/:id')
    @ApiOperation({ summary: 'Update product' })
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) productDto: ProductDto): Promise<Product | null>{
        return this.productService.updateProduct(id, productDto);
    }

    @Delete('delete/:id')
    @ApiOperation({ summary: 'Delete product' })
    async deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }
    
}