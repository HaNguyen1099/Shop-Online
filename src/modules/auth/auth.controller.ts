import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRegisterDto, UserLoginDto } from "../../dto/user.dto";
import { plainToInstance } from "class-transformer";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";
import { RefreshAuthGuard } from "./guards/refresh-jwt.guard";
import { MailerService } from "@nestjs-modules/mailer";

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService
    ) {}
    
    @Post('/register')
    @ApiOperation({ summary: 'Register account' })
    async register(@Body() userDto: UserRegisterDto): Promise<User>{
        const user = await this.userService.register(userDto);

        await this.mailerService.sendMail({
            to: userDto.email,
            subject: "Welcome to my website!",
            template: "./hello",
            context: {
                name: userDto.name
            }
        })

        return plainToInstance(User, user)
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login account' })
    async login(@Req() req, @Body() userDto: UserLoginDto): Promise<any>{
        const user = await this.authService.login(userDto);

        return plainToInstance(User, user)
    }

    @Post("/refresh")
    @UseGuards(RefreshAuthGuard)
    @ApiOperation({ summary: 'Refresh token' })
    refreshToken(@Req() req){
        return this.authService.refreshToken(req.user.id)
    }
}