import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    const passwordEquals = await bcrypt.compare(pass, user.password);

    if (user && passwordEquals) {
      return user;
    }

    return null;
  }
}
