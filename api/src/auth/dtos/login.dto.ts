import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'The user email',
        example: 'mudar@email.com',
    })
    email: string;

    @ApiProperty({
        description: 'The user password',
        example: 'senhaSecreta123',
    })
    password: string;
}