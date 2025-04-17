import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Login, Response } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'validLogin' })
  async validLogin({
    login,
    password,
  }: {
    login: Login;
    password: string;
  }): Promise<Response> {
    try {
      const response = await this.authService.validLogin({ login, password });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'validateTempPassword' })
  async validateTempPassword({
    memberNumber,
    tempPass,
    newPass,
  }: {
    memberNumber: number;
    tempPass: string;
    newPass: string;
  }): Promise<Response> {
    try {
      const response = await this.authService.validateTempPassword({
        memberNumber,
        tempPass,
        newPass,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'emailNotInUse' })
  async emailNotInUse(email: string): Promise<Response> {
    try {
      const response = await this.authService.emailNotInUse(email);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
