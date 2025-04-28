import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewData, PersonalizedResponse } from './types';

@Injectable()
export class FrequentUsersService {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private UserClient: ClientProxy,
  ) {}

  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const result = this.UserClient.send({ cmd: 'getAllUsers' }, {});

      const value = await lastValueFrom(result);

      return value;
    } catch (error) {
      throw error;
    }
  }

  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const result = this.UserClient.send({ cmd: 'getUser' }, memberNumber);

      const value = await lastValueFrom(result);

      return value;
    } catch (error) {
      throw error;
    }
  }

  async updateCountry({
    memberNumber,
    newData,
  }: {
    memberNumber: number;
    newData: NewData;
  }): Promise<PersonalizedResponse | void> {
    try {
      let updatedData: NewData = {};

      const result = await lastValueFrom(
        this.UserClient.send(
          { cmd: 'updateCountry' },
          { newCountry: newData.newCountry, memberNumber: memberNumber },
        ),
      );

      updatedData.newCountry = result.message;

      return { statusCode: 200, data: updatedData };
    } catch (error) {
      throw error;
    }
  }
}
