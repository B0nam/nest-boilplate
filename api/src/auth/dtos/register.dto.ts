import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {

    @IsEmail()
    @ApiProperty({
        description: 'The user email',
        example: 'mudar@email.com',
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        description: 'The user username',
        example: 'Thiago',
    })
    username: string;

    @MinLength(8)
    @ApiProperty({
        description: 'The user password',
        example: 'senhaSecreta123',
    })
    password: string;
}