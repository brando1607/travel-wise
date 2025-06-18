import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'welcomeEmail' })
  async welcomeEmail({
    email,
    memberNumber,
  }: {
    email: string;
    memberNumber: number;
  }): Promise<void> {
    try {
      await this.authService.welcomeEmail({
        email,
        memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'sendTemporaryPassword' })
  async sendTemporaryPassword({
    email,
    tempPassword,
  }: {
    email: string;
    tempPassword: string;
  }): Promise<void> {
    try {
      await this.authService.sendTemporaryPassword({
        email,
        tempPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateUser' })
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
      await this.authService.updateUser({
        email,
        updatedData,
        memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'tooManyLoginAttempts' })
  async tooManyLoginAttempts({
    email,
    memberNumber,
  }: {
    email: string;
    updatedData: string;
    memberNumber: number;
  }): Promise<void> {
    try {
      await this.authService.tooManyLoginAttempts({
        email,
        memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }
}
