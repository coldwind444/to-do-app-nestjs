import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import * as bcrypt from 'bcrypt'
import { GetUserDto } from "./dtos/get-user.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    encode(input: string): Promise<string> {
        const saltOrRounds = 10
        return bcrypt.hash(input, saltOrRounds)
    }

    match(input: string, hash: string): Promise<boolean> {
        return bcrypt.compare(input, hash)
    }

    async create(req: CreateUserDto): Promise<User> {
        const user = await this.userRepository.findOneBy({ username: req.username })

        if (user) throw new HttpException('This username has been used.', HttpStatus.CONFLICT)

        const hash = await this.encode(req.password)

        var newUser = this.userRepository.create({
            ...req,
            password: hash
        })

        return this.userRepository.save(newUser)
    }

    async findByUsername(name: string): Promise<User> {
        var user = await this.userRepository.findOneBy({ username: name })
        if (!user) throw new HttpException('No user found.', HttpStatus.NOT_FOUND)
        return user
    }

    async findById(id: number): Promise<User> {
        var user = await this.userRepository.findOneBy({ id: id })
        if (!user) throw new HttpException('No user found.', HttpStatus.NOT_FOUND)
        return user
    }

    async changePassword(userid: number, password: string): Promise<void> {
        const hash = await this.encode(password)

        const user = await this.userRepository.preload({
            id: userid,
            password: hash
        })

        if (!user) throw new HttpException('User not found.', HttpStatus.NOT_FOUND)

        await this.userRepository.save(user)

    }
}