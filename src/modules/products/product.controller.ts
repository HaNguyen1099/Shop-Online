import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from "../../dto/product.dto";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../../base/decorators/role.decorator";
import { Role } from "../../base/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { ApiFiles } from "../../base/decorators/api.decorator";


@ApiTags('products')
@Controller('products')

export class ProductController {
    constructor(private readonly productService: ProductService) {};

    @Post('/create')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Create product' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiFiles('images')
    async createProduct(
        @Body() productDto: ProductDto,
        @Req() req: any
    ): Promise<any>{
        productDto.images = req.body.images;

        return this.productService.create(productDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    async getProducts(
        @Query() optionDto: OptionDto
    ): Promise<any> {
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
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiFiles('images')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number, 
        @Body() productDto: ProductDto,
        @Req() req: any
    ): Promise<any>{
        productDto.images = req.body.images;

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