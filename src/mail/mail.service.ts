import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAuthMail(email: string, name: string, id: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '연구방 회원가입 인증 메일입니다.',
      from: 'insertxyz@naver.com',
      template: '/authMail',
      context: {
        name,
        id,
      },
    });
  }
}
