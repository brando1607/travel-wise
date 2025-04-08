import { Controller } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { MessagePattern } from '@nestjs/microservices';
import { User, PartialUser } from './types';

@Controller('frequent.users')
export class FrequentUsersController {
  constructor(private readonly frequentUsersService: FrequentUsersService) {}

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers(): Promise<User[] | string> {
    try {
      const users = await this.frequentUsersService.getAllUsers();

      return users;
    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(memberNumber: number): Promise<User | string> {
    try {
      const user = await this.frequentUsersService.getUser(memberNumber);

      return user;
    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: 'updateUser' })
  async updateUser({
    memberNumber,
    newData,
  }: {
    memberNumber: number;
    newdata: PartialUser;
  }): Promise<User | string> {
    try {
      const updatedUser = await this.frequentUsersService.updateUser({
        memberNumber,
        newData,
      });

      return updatedUser;
    } catch (error) {
      return error;
    }
  }
}
