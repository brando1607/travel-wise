import { Controller } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { MessagePattern } from '@nestjs/microservices';
import { PersonalizedResponse, NewUser, NameUpdate } from './types';

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

  @MessagePattern({ cmd: 'blockAccount' })
  async blockAccount(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const blockAccount =
        await this.frequentUsersService.blockAccount(memberNumber);

      return blockAccount;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'accountIsBlocked' })
  async accountIsBlocked(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const result =
        await this.frequentUsersService.accountIsBlocked(memberNumber);

      return result;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'activateAccount' })
  async activateAccount(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const result =
        await this.frequentUsersService.activateAccount(memberNumber);

      return result;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateCountry' })
  async updateCountry({
    newCountry,
    memberNumber,
  }: {
    newCountry: string;
    memberNumber: number;
  }): Promise<PersonalizedResponse | void> {
    try {
      const updatedCountry = await this.frequentUsersService.updateCountry({
        memberNumber,
        newCountry,
      });

      return { statusCode: 200, message: 'Country', data: updatedCountry };
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'updateName' })
  async updateName({
    memberNumber,
    newName,
  }: {
    memberNumber: number;
    newName: NameUpdate;
  }): Promise<PersonalizedResponse | void> {
    try {
      const updateName = await this.frequentUsersService.updateName({
        memberNumber,
        newName,
      });

      return { statusCode: 200, message: 'Name', data: updateName };
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'handleNameUpdate' })
  async handleNameUpdate({
    memberNumber,
    id,
    accept,
  }: {
    memberNumber: number;
    id: number;
    accept: boolean;
  }): Promise<PersonalizedResponse | void> {
    try {
      const handleUpdate = await this.frequentUsersService.handleNameUpdate({
        memberNumber,
        id,
        accept,
      });

      return handleUpdate;
    } catch (error) {
      throw error;
    }
  }
}
