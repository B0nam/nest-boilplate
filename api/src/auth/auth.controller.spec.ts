import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService to register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'testauthcontroller@testauthcontroller.com',
        username: 'testandoauthcontroller',
        password: 'senha',
      };

      const result = { id: 1, email: registerDto.email, username: registerDto.username };

      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(registerDto);

      expect(response).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto.email, registerDto.username, registerDto.password);
    });

    it('should throw ConflictException if the email is already in use', async () => {
      const registerDto: RegisterDto = {
        email: 'existinguser@existinguser.com',
        username: 'existinguser',
        password: 'password',
      };

      mockAuthService.register.mockRejectedValue(new ConflictException('Email already in use'));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return an access token on valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'testauthcontroller@testauthcontroller.com',
        password: 'password',
      };

      const token = { accessToken: 'jwt_token' };

      mockAuthService.signIn.mockResolvedValue(token);

      const response = await controller.login(loginDto);

      expect(response).toEqual(token);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'testauthcontroller@testauthcontroller.com',
        password: 'wrongpassword',
      };

      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
