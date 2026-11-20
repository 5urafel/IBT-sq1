import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    const newUser = await this.userService.createUser({
      email: dto.email,
      passwordHash,
    });

    return {
      id: newUser?.id,
      email: newUser?.email,
      roles: newUser?.roles,
    };
  }
}
