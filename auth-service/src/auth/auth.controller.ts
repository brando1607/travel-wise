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
      const userLogin = await this.authService.validLogin({ login, password });

      return userLogin;
    } catch (error) {
      throw error;
    }
  }
}
