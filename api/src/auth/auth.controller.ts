import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './cross-cutting/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'register a new user' })
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(
            registerDto.email,
            registerDto.username,
            registerDto.password
        );
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'login' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto.email, loginDto.password);
    }
}
