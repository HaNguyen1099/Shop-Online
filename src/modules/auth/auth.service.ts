import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { UserLoginDto, UserRegisterDto } from "../../dto/user.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async login(userDto: UserLoginDto): Promise< { accessToken: string } > {
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

            const payload = { email: user.email, sub: user.id };
        
            return {
                accessToken: this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException("Password does not match"); 
        }

    }

}