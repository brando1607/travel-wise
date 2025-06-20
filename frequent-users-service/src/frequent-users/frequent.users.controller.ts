import { Controller } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  PersonalizedResponse,
  NewUser,
  NameUpdate,
  PersonalInfo,
  AddBookingCode,
} from './types';

@Controller('frequent-users')
export class FrequentUsersController {
  constructor(private readonly frequentUsersService: FrequentUsersService) {}

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.frequentUsersService.getAllUsers();

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getUsers' })
  async getUsers(
    memberNumbers: number[],
  ): Promise<PersonalInfo[] | void | PersonalizedResponse> {
    try {
      const response = await this.frequentUsersService.getUsers(memberNumbers);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.frequentUsersService.getUser(memberNumber);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getUserEmail' })
  async getUserEmail(email: string): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.frequentUsersService.getUserEmail(email);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(user: NewUser): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.frequentUsersService.createUser(user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'deleteUser' })
  async deleteUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.frequentUsersService.deleteUser(memberNumber);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'blockAccount' })
  async blockAccount(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.frequentUsersService.blockAccount(memberNumber);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'isAccountBlocked' })
  async accountIsBlocked(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.frequentUsersService.isAccountBlocked(memberNumber);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'activateAccount' })
  async activateAccount(
    memberNumber: number,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.frequentUsersService.activateAccount(memberNumber);

      return response;
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
      const response = await this.frequentUsersService.handleNameUpdate({
        memberNumber,
        id,
        accept,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'addBookingCodeInFrequentUser' })
  async addBookingCodeInFrequentUser(
    data: AddBookingCode,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.frequentUsersService.addBookingCodeInFrequentUser(data);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
