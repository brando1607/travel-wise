import { Controller } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { MessagePattern } from '@nestjs/microservices';
import { UpdatedUser, PersonalizedResponse, NewUser } from './types';

@Controller('frequent-users')
export class FrequentUsersController {
  constructor(private readonly frequentUsersService: FrequentUsersService) {}

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const users = await this.frequentUsersService.getAllUsers();

      return users;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const user = await this.frequentUsersService.getUser(memberNumber);

      return user;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getUserEmail' })
  async getUserEmail(email: string): Promise<PersonalizedResponse | void> {
    try {
      const emailExists = await this.frequentUsersService.getUserEmail(email);

      return emailExists;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(user: NewUser): Promise<PersonalizedResponse | void> {
    try {
      const createUser = await this.frequentUsersService.createUser(user);

      return createUser;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteUser' })
  async deleteUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const deleteUser =
        await this.frequentUsersService.deleteUser(memberNumber);

      return deleteUser;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateCountry' })
  async updateUser({
    newCountry,
    memberNumber,
  }: {
    newCountry: UpdatedUser;
    memberNumber: number;
  }): Promise<PersonalizedResponse | void> {
    try {
      const updatedUser = await this.frequentUsersService.updateCountry({
        memberNumber,
        newCountry,
      });

      return { statusCode: 200, message: 'Country', data: updatedUser };
    } catch (error) {
      throw error;
    }
  }
}
