import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { plainToInstance } from "class-transformer";
import { UserUpdateDto } from "../../dto/user.dto";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "../../enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../../base/cloudinary/cloudinary.service";

@Roles(Role.USER)
@ApiTags('users')
@Controller('users')

export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) {};
    
    @Get('/profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'View profile' })
    async getProfile(@Req() req): Promise<User>{
        const userId = req.user.id;
        const user = this.userService.getProfile(userId);
        return plainToInstance(User, user);
    }

    @Patch('profile/update')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Update profile' })
    async updateProfile(
        @Req() req,
        @Body() userDto: UserUpdateDto
    ): Promise<User>{
        const userId = req.user.id;
        const user = this.userService.updateProfile(userId, userDto);
        return plainToInstance(User, user);
    }

    @Delete('delete/:id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Delete account' })
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }

    @Post('upload-avatar')
    @ApiOperation({ summary: 'Upload a file with authentication' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            avatar: {
                type: 'string',
                format: 'binary',
            },
        },
        },
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(
        @Req() req: any, 
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
                  new FileTypeValidator({ fileType: 'image/(jpeg|jpg|png)' }),
                ],
              }),
        ) file: Express.Multer.File
    ){
        const userId = req.user.id;
        if (!file) {
            throw new BadRequestException('File not found');
        }
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        const url = uploadResult.url;
        return this.userService.uploadAvatar(userId, url);
    }
}