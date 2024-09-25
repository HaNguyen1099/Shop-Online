import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { JwtAuthGuard } from "../auth/passport/jwt-guard";
import { plainToInstance } from "class-transformer";


@ApiTags('users')
@Controller('users')

export class UserController {
    constructor(private readonly userService: UserService) {};
    
    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'View profile' })
    async getProfile(@Req() req): Promise<User>{
        const userId = req.user.userId 
        const user = this.userService.getUserById(userId);
        return plainToInstance(User, user)
    }

    // @Patch('updateProfile')
    // @UseGuards(JwtAuthGuard)
    // @ApiOperation({ summary: 'Update profile' })
    // async updateProfile(@Req() req): Promise<User>{
    //     const userId = req.user.userId 
        
    // }
}