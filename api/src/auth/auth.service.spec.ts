import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    password: 'hashedpassword',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const accessToken = 'jwt_token';

      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashedPassword });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signIn(email, password);

      expect(result).toEqual({
        accessToken,
        expiresIn: expect.any(Date), 
        userId: mockUser.id,
      });

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ id: mockUser.id, role: undefined }, { expiresIn: '1h' });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if the user is not found', async () => {
      const email = 'notfound@test.com';
      const password = 'password';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      const email = 'test@test.com';
      const password = 'wrongpassword';

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should call UsersService to create a new user', async () => {
      const email = 'newuser@test.com';
      const username = 'newuser';
      const password = 'password';
      const createdUser = { id: 2, email, username: 'newuser', role: 'default' };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(email, username, password);

      expect(result).toEqual({
        id: createdUser.id,
        name: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(email, username, password, 'default');
    });

    it('should throw ConflictException if email is already in use', async () => {
      const email = 'existinguser@test.com';
      const username = 'existinguser';
      const password = 'password';

      mockUsersService.create.mockImplementation(() => {
        throw new ConflictException('Email already in use');
      });

      await expect(service.register(email, username, password)).rejects.toThrow(ConflictException);
    });
  });
});
