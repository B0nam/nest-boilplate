import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserInfo } from "./dtos/user-info.dto";
import { Role } from "./enums/role.enum";

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService) { }

    @ApiOperation({ summary: 'get user by id' })
    @ApiParam({ name: 'id', description: 'user id', example: '5f9d7b3b9f6b6b001f3b3b3b' })
    @Get(':id')
    async getUserById(@Req() request: Request, @Param() params): Promise<UserInfo> {
        const requestUser = request['user']

        if (requestUser.role != Role.ADMIN && requestUser.id != params.id) {
            throw new NotFoundException(`User not found`);
        }

        const user = await this.usersService.findById(params.id);
        return UserInfo.fromEntity(user);
    }

    @ApiOperation({ summary: 'lists all users' })
    @Get()
    async getUsers(): Promise<UserInfo[]> {
        const users = await this.usersService.findAll();
        return users.map(user => UserInfo.fromEntity(user));
    }
}