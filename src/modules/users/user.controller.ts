import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from "./user.service";


@ApiTags('users')
@Controller('users')

export class UserController {
    constructor(private readonly userService: UserService) {};
    
}