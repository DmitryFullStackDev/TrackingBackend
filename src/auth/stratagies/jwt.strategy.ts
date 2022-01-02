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

  async validate(payload: payloadValidate) {
    const email = await this.usersService.getUserByEmail(payload.email);
    const id = await this.usersService.getUserById(payload.id);

    if (email && id) {
      return { id: payload.id, email: payload.email };
    }

    throw new UnauthorizedException('you don`t have permission to this page');
  }
}
