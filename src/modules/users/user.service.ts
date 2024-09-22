import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"; 
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { UserDto } from "../../dto/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async register(userDto: UserDto): Promise<User> {
        const { password, email, ...rest } = userDto;

        const hashPassword = await bcrypt.hash(password, 10);

        const existEmail = await this.usersRepository.findOneBy({ email }) 

        if (existEmail) {
            throw new ConflictException(`Email ${email} đã được sử dụng.`);
        }

        const newUser = this.usersRepository.create({
            ...rest,
            email,
            password: hashPassword
        })
        
        return this.usersRepository.save(newUser)
    }
}

