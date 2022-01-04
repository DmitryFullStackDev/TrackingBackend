import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  imports: [SequelizeModule.forFeature([Token])],
  exports: [TokenService],
})
export class TokenModule {}
