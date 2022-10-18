// To store the datas in the database as repository to User table
import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
// triggers the datas to the repositary
@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
    }
   // To store the user datas in mysqli in User Table
    async create(data: any): Promise<User> {
        return this.userRepository.save(data);
    }
   // Inorder to search in login page,the datas would check if it exists or not
    async findOne(condition: any): Promise<User> {
        return this.userRepository.findOne(condition);
    }
}