import { MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { CreateUsersDto } from './dto/createUser.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly mailerService: MailerService,
    readonly mailService: MailService,
  ) {}

  public example(): void {
    const mail = {
      to: 'qwepoint@yandex.by', // List of receivers email address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcавыome', // plaintext body
      html: '<b>welаcome</b>', // HTML body content
    };

    this.mailService.example(mail);
  }

  async createUser(dto: CreateUsersDto) {
    const isUser = this.getUserByEmail(dto.email);

    if (isUser) {
      throw new ForbiddenException('this email is already exist');
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
    });

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }
}
