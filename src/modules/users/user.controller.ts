import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";
import { User } from "../../entities/user.entity";
import { UserDto } from "../../dto/user.dto";
import { plainToInstance } from "class-transformer";


@ApiTags('users')
@Controller('users')

export class UserController {
    constructor(private readonly userService: UserService) {};

    @Post('/register')
    @ApiOperation({ summary: 'Register account' })
    async register(
        @Body(new ValidationPipe()) userDto: UserDto
    ): Promise<User>{
        const user = await this.userService.register(userDto);

        return plainToInstance(User, user)
    }
}