import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './auth/token/token.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.NODEMAOLER_HOST,
        port: process.env.NODEMAOLER_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.NODEMAOLER_AUTH,
          pass: process.env.NODEMAOLER_PASS,
        },
      },
      defaults: {
        from: process.env.NODEMAOLER_FROM, // outgoing email ID
      },
    }),
    UsersModule,
    AuthModule,
    MailModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
