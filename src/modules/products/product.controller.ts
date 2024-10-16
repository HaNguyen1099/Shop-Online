import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from "../../dto/product.dto";
import { Product } from "../../entities/product.entity";
import { OptionDto } from "../../dto/option.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../../base/decorators/role.decorator";
import { Role } from "../../base/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { ApiExcel, ApiFiles } from "../../base/decorators/api.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from 'xlsx';

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

    @Post('/uploadExcel')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Upload file excel' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiExcel('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(
        @UploadedFile() file: Express.Multer.File
    ): Promise<any>{
        if (!file) {
            throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
        }
    
        // Đọc nội dung file Excel
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    
        // Lưu dữ liệu vào database
        await this.productService.uploadExcel(data);
    
        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "File uploaded and data saved successfully!"
        }
    }

    @Get('/exportExcel')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Export file excel' })
    @ApiBearerAuth()
    async exportExcel(@Res({ passthrough: true }) res: Response): Promise<StreamableFile>{
        return await this.productService.exportExcel(res);
    }
}