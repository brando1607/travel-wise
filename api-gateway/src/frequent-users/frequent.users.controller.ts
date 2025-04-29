import {
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Controller,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FrequentUsersService } from './frequent.users.service';
import { PersonalizedResponse, NewData, TokenData } from './types';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('frequent-users')
export class FrequentUsersController {
  constructor(private readonly frequentUsersService: FrequentUsersService) {}

  @Get()
  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const result = await this.frequentUsersService.getAllUsers();

      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get(':memberNumber')
  async getUser(
    @Param('memberNumber') memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const result = await this.frequentUsersService.getUser(
        Number(memberNumber),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateCountry(
    @Body() newData: NewData,
    @Req() req: Request,
  ): Promise<PersonalizedResponse | void> {
    try {
      const token = req.user as TokenData;
      let result: any;

      if (token) {
        const memberNumber = token.memberNumber;
        result = await this.frequentUsersService.updateCountry({
          memberNumber,
          newData,
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
