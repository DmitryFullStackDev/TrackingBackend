import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { CreateUsersDto } from 'src/users/dto/createUser.dto';
import { UsersService } from '../users/users.service';
import { TokenService } from './token/token.service';

type sendConfirmType = { email: string; id: number; status: string };
type tokenType = { token: string };
@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.getUserByEmail(email);

    const passwordEquals = await bcrypt.compare(pass, user.password);

    if (user && passwordEquals) {
      return { email: user.email, id: user.id };
    }

    return null;
  }

  async singIn(user: { email: string; id: number }) {
    const payload = { email: user.email, id: user.id };

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(dto: CreateUsersDto) {
    const { email, id, status } = await this.usersService.createUser(dto);
    await this.sendConfirmation({ email, id, status });
    const payload = { email, id };

    return {
      email,
      id,
      status,
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendConfirmation(user: sendConfirmType) {
    const token = await this.signUser(user, false);
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;

    await this.mailService.send({
      to: user.email,
      subject: 'Verify User',
      html: `
            <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
        `,
    });
  }

  async signUser(
    user: sendConfirmType,
    withStatusCheck = true,
  ): Promise<string> {
    if (withStatusCheck && user.status !== 'active') {
      throw new MethodNotAllowedException();
    }

    const tokenPayload = {
      email: user.email,
      id: user.id,
      status: user.status,
    };
    const token = await this.jwtService.sign(tokenPayload);

    const expireAt1 = new Date().setDate(new Date().getDate() + 1);
    const expireAt = new Date(expireAt1);

    await this.tokenService.create({
      token,
      expireAt,
      userId: user.id,
    });

    return token;
  }

  async confirm({ token }: tokenType) {
    const data = await this.verifyToken(token);
    const user = await this.usersService.getUserById(data.id);

    await this.tokenService.deleteToken(token, data.id);
    console.log(data);
    console.log(user);
    if (user && user.status === 'pending') {
      user.status = 'active';
      user.save();
      return;
    }
    throw new BadRequestException('Confirmation error');
  }

  private async verifyToken(token: string): Promise<sendConfirmType> {
    const data = this.jwtService.verify(token) as sendConfirmType;
    const tokenExists = await this.tokenService.isTokenExist(token, data.id);

    if (tokenExists) {
      return data;
    }
    throw new UnauthorizedException();
  }
}
