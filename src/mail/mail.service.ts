import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { mailType } from './mail.type';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(mail: mailType) {
    try {
      const success = await this.mailerService.sendMail(mail);

      console.log(success);
    } catch (error) {
      console.log(error);
    }
  }
}
