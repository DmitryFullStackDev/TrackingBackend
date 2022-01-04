import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/stratagies/jwt.strategy';
import { LocalStrategy } from 'src/auth/stratagies/local.strategy';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    PassportModule,
    UsersModule,
    MailModule,
    ConfigModule,
    TokenModule,
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '50h' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
