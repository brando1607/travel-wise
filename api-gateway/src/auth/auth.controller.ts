import {
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { NewUser, UserData } from './types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(@Body() userData: UserData): Promise<NewUser> {
    try {
      const result = await this.authService.register(userData);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
