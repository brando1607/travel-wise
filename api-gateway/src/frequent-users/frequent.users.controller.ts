import {
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Controller,
} from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { PersonalizedResponse } from './types';

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
}
