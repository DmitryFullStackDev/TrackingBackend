import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TokenDto } from './dto/token.dto';
import { Token } from './token.model';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token) private tokenRepository: typeof Token) {}

  async create(dto: TokenDto) {
    const token = await this.tokenRepository.create(dto);

    return token;
  }

  async isTokenExist(token: string, userId: number) {
    const isToken = await this.tokenRepository.findOne({
      where: { token, userId },
    });

    if (isToken) {
      return true;
    }

    return false;
  }

  async deleteToken(token: string, userId: number) {
    const isToken = await this.tokenRepository.findOne({
      where: { token, userId },
    });

    if (isToken) {
      await isToken.destroy();
      return;
    }

    throw new ForbiddenException('this token is not exist');
  }
}
