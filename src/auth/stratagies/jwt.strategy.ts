import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type payloadValidate = { id: number; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate({ id, email }: payloadValidate) {
    const isEmail = await this.usersService.getUserByEmail(email);
    const isId = await this.usersService.getUserById(id);

    if (isEmail && isId) {
      return { id, email };
    }

    throw new UnauthorizedException('you don`t have permission to this page');
  }
}
