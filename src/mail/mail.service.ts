import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public example(): void {
    this.mailerService
      .sendMail({
        to: 'qwepoint@yandex.by', // List of receivers email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcавыome', // plaintext body
        html: '<b>welаcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
