import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto } from "../../dto/user.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import refreshJwtConfig from "../../../config/jwt/refresh-jwt.config";
import { ConfigType } from "@nestjs/config";
import { Role } from "../../enums/role.enum";
import { CurrentUser } from "../../types/user.type";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
    ) {}

    async login(userDto: UserLoginDto): Promise< any > {
        const { email, password } = userDto;

        const user = await this.usersRepository.findOneBy({ email }) 

        if (!user) {
            throw new ConflictException("Could not find user");
        }

        const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (passwordMatched) {
            delete user.password;

            const payload = { sub: user.id };

            const accessToken = this.jwtService.sign(payload);
            const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
        
            return {
                id: user.id,
                accessToken,
                refreshToken
            };
        } else {
            throw new UnauthorizedException("Password does not match"); 
        }

    }

    refreshToken(userId: number) {
        const payload = { sub: userId };

        const accessToken = this.jwtService.sign(payload);

        return {
            id: userId,
            accessToken: accessToken
        }
    }

    async validateJwtUser(userId: number) {
        const user = await this.usersRepository.findOneBy({id: userId});

        if (!user) throw new UnauthorizedException("User not found!");

        const currentUser: CurrentUser = {
            id: user.id,
            role: user.role
        }

        return currentUser;
    }
}