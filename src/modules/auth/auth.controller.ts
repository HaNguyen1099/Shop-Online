import { Body, Controller, Post } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { ApiOperation } from "@nestjs/swagger";
import { UserRegisterDto, UserLoginDto } from "../../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}
    
    @Post('/register')
    @ApiOperation({ summary: 'Register account' })
    async register(@Body() userDto: UserRegisterDto): Promise<User>{
        const user = await this.userService.register(userDto);

        return plainToInstance(User, user)
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login account' })
    async login(@Body() userDto: UserLoginDto): Promise<User>{
        const user = await this.authService.login(userDto);

        return plainToInstance(User, user)
    }
}