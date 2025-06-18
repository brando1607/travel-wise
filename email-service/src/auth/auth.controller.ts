import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern({ cmd: 'welcomeEmail' })
  async welcomeEmail(
    @Payload() data: { email: string; memberNumber: number },
  ): Promise<void> {
    try {
      await this.authService.welcomeEmail({
        email: data.email,
        memberNumber: data.memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }

  @EventPattern({ cmd: 'sendTemporaryPassword' })
  async sendTemporaryPassword(
    @Payload() data: { email: string; tempPassword: string },
  ): Promise<void> {
    try {
      await this.authService.sendTemporaryPassword({
        email: data.email,
        tempPassword: data.tempPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  @EventPattern({ cmd: 'updateUser' })
  async updateUser(
    @Payload()
    data: {
      email: string;
      updatedData: string;
      memberNumber: number;
    },
  ): Promise<void> {
    try {
      await this.authService.updateUser({
        email: data.email,
        updatedData: data.updatedData,
        memberNumber: data.memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }

  @EventPattern({ cmd: 'tooManyLoginAttempts' })
  async tooManyLoginAttempts(
    @Payload() data: { email: string; memberNumber: number },
  ): Promise<void> {
    try {
      await this.authService.tooManyLoginAttempts({
        email: data.email,
        memberNumber: data.memberNumber,
      });
    } catch (error) {
      throw error;
    }
  }
}
