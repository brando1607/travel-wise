import { Injectable } from '@nestjs/common';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';

@Injectable()
export class AuthService {
  constructor(private readonly mail: NodemailerService) {}

  async welcomeEmail({
    email,
    memberNumber,
  }: {
    email: string;
    memberNumber: number;
  }): Promise<void> {
    try {
      const text = `Thank you for creating an account with Travel Wise. This is your account number: ${memberNumber}. You can use it when making a booking so we can get your information.`;
      const subject = `Welcome to Travel Wise.`;

      //send welcome email

      await this.mail.sendEmail({ email, text, subject });
    } catch (error) {
      throw error;
    }
  }

  async sendTemporaryPassword({
    email,
    tempPassword,
  }: {
    email: string;
    tempPassword: string;
  }): Promise<void> {
    try {
      const text = `Your temporary password is ${tempPassword}. It's valid for 1 minute.`;
      const subject = 'Your temporary password.';

      //send temporary password
      await this.mail.sendEmail({ email, text, subject });
    } catch (error) {
      throw error;
    }
  }

  async updateUser({
    email,
    updatedData,
    memberNumber,
  }: {
    email: string;
    updatedData: string;
    memberNumber: number;
  }): Promise<void> {
    try {
      const text = `${updatedData} changed for account number ${memberNumber}. If it wasn't you, please get in touch with us.`;
      const subject = `Account updated.`;

      //send confirmation
      await this.mail.sendEmail({ email, text, subject });
    } catch (error) {
      throw error;
    }
  }
}
