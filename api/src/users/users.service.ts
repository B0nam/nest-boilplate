import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { env } from 'process';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email });        
    }

    async create(email: string, username: string, password: string, role: Role): Promise<any> {
        const existsUser = await this.findByEmail(email);
        if (existsUser) {
            throw new ConflictException();
        }

        const hash = await bcrypt.hash(password, Number(env.BCRYPT_ROUNDS));
        
        const createdUser = new this.userModel({ email, password: hash, username, role });
        return createdUser.save();
    }

    async findById(id: ObjectId): Promise<User | undefined> {
        return await this.userModel.findById(id);
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find();
    }
}