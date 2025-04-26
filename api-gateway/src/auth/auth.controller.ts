import {
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Controller,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { NewUser, UserData, TokenData, Result } from './types';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LocalGuard } from 'src/guards/local.guard';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: UserData): Promise<NewUser> {
    try {
      const result = await this.authService.register(userData);

      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Result> {
    try {
      const tokenData = req.user as TokenData;
      const token = req.cookies['loginToken'] ? true : false;

      const createToken = await this.authService.login({ token, tokenData });

      res.cookie('loginToken', createToken.message, { maxAge: 30 * 60 * 1000 });

      return { statusCode: 204, message: 'Login successfull, token created' };
    } catch (error) {
      throw error;
    }
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<Result> {
    try {
      res.clearCookie('loginToken');

      return { statusCode: 204, message: 'User logged out.' };
    } catch (error) {
      throw error;
    }
  }
}
