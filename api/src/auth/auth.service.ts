import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserInfo } from 'src/users/dtos/user-info.dto';
import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user?.email !== email) {
            throw new UnauthorizedException("e-mail not found!");
        }

        const passwordMatches = await bcrypt.compare(pass, user.password)
        if (!passwordMatches) {
            throw new UnauthorizedException("password incorrect!");
        }
        const payload = { id: user.id, role: user.role }
        const currentDate = new Date()
        currentDate.setHours(currentDate.getHours() + 1)

        return {
            accessToken: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
            expiresIn: currentDate,
            userId: user.id,
        }
    }

    async register(email: string, username: string, password: string): Promise<any> {
        const user = await this.usersService.create(email, username, password, Role.DEFAULT);
        return UserInfo.fromEntity(user)
    }
}
