import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdatedUser, PersonalizedResponse } from './types';

@Injectable()
export class FrequentUsersService {
  constructor(@Inject('FREQUENT-USERS-SERVICE') private client: ClientProxy) {}

  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const result = this.client.send({ cmd: 'getAllUsers' }, {});

      const value = await lastValueFrom(result);

      return value;
    } catch (error) {
      throw error;
    }
  }

  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const result = this.client.send({ cmd: 'getUser' }, memberNumber);

      const value = await lastValueFrom(result);

      return value;
    } catch (error) {
      throw error;
    }
  }

  async updateUser({
    memberNumber,
    newData,
  }: {
    memberNumber: number;
    newData: UpdatedUser;
  }): Promise<PersonalizedResponse | void> {
    try {
      const result = this.client.send(
        { cmd: 'updateUser' },
        { memberNumber, newData },
      );

      const value = await lastValueFrom(result);

      return value;
    } catch (error) {
      throw error;
    }
  }
}
