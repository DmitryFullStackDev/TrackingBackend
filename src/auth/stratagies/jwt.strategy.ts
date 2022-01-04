import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

type payloadValidate = { id: number; email: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate({ id, email }: payloadValidate) {
    const isEmail = await this.usersService.getUserByEmail(email);
    const isId = await this.usersService.getUserById(id);

    if (isEmail && isId) {
      return isEmail;
    }

    throw new UnauthorizedException('you don`t have permission to this page');
  }
}
