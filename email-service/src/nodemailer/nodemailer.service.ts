import { Injectable } from '@nestjs/common';
import { getEnv } from 'src/utils/getEnv';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: getEnv('EMAIL_USER'),
      pass: getEnv('EMAIL_PASS'),
    },
  });

  async sendEmail({ email, text, subject }) {
    const mailSettings = {
      from: 'Travel Wise Assistant travelw.assistant@gmail.com',
      to: email,
      subject: subject,
      text: text,
    };
    await this.transporter.sendMail(mailSettings);
  }
}
