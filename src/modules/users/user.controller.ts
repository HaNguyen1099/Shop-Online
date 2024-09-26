import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, SetMetadata, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { plainToInstance } from "class-transformer";
import { UserUpdateDto } from "../../dto/user.dto";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "../../enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";

@Roles(Role.USER)
@ApiTags('users')
@Controller('users')

export class UserController {
    constructor(private readonly userService: UserService) {};
    
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
}