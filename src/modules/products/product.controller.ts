import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from "../../dto/product.dto";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "../../enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";


@ApiTags('products')
@Controller('products')

export class ProductController {
    constructor(private readonly productService: ProductService) {};

    @Post('/create')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Create product' })
    async createProduct(
        @Body() productDto: ProductDto
    ): Promise<Product>{
        return this.productService.create(productDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async getProducts(
        @Query() optionDto: OptionDto
    ): Promise<Product[]> {
        return this.productService.getList(optionDto);
    }

    @Get('/detail/:id')
    @ApiOperation({ summary: 'Get product detail' })
    async detailProduct(@Param('id') id: number): Promise<Product> {
        return this.productService.getDetail(id);
    }

    @Patch('/edit/:id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Update product' })
    async updateProduct(
        @Param('id', ParseIntPipe) id: number, 
        @Body() productDto: ProductDto
    ): Promise<Product>{
        return this.productService.update(id, productDto);
    }

    @Delete('delete/:id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Delete product' })
    async deleteProduct(@Param('id') id: number) {
        return this.productService.delete(id);
    }
}