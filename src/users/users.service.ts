import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mail/mail.service';
import { CreateUsersDto } from './dto/createUser.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private mailService: MailService,
  ) {}

  public example(): void {
    const mail = {
      to: 'qwepoint@yandex.by', // List of receivers email address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcавыome', // plaintext body
      html: '<b>welаcome</b>', // HTML body content
    };

    this.mailService.send(mail);
  }

  async createUser(dto: CreateUsersDto) {
    const isUser = await this.getUserByEmail(dto.email);

    if (isUser) {
      throw new ForbiddenException('this email is already exist');
    }

    const hashPassword = await this.hashPassword(dto.password);
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
      raw: true,
      where: { email: email },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      raw: true,
      where: { id },
    });

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async update(id: number, password: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    user.password = password;

    user.save();

    return user;
  }

  async updateStatus(id: number, status: 'pending' | 'blocked' | 'active') {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    user.status = status;

    user.save();

    return user;
  }
}
