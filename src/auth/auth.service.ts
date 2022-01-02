import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    const passwordEquals = await bcrypt.compare(pass, user.password);

    if (user && passwordEquals) {
      return { email: user.email, id: user.id };
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
