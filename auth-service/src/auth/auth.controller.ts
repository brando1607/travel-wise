import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { Login, Response } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'addPassword' })
  async addPassword({
    memberNumber,
    password,
  }: {
    memberNumber: number;
    password: string;
  }): Promise<Response> {
    try {
      const result = await this.authService.addPassword({
        memberNumber,
        password,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'validLogin' })
  async validLogin({
    username,
    password,
  }: {
    username: Login;
    password: string;
  }): Promise<Response> {
    try {
      const response = await this.authService.validLogin({
        username,
        password,
      });

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

  @MessagePattern({ cmd: 'sendTemporaryPassword' })
  async sendTemporaryPassword(
    login: string | number,
  ): Promise<Response | void> {
    try {
      const response = await this.authService.sendTemporaryPassword(login);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'changePassword' })
  async changePassword({
    login,
    tempPass,
    newPass,
  }: {
    login: string | number;
    tempPass: string;
    newPass: string;
  }): Promise<Response> {
    try {
      const result = await this.authService.changePassword({
        login,
        tempPass,
        newPass,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
