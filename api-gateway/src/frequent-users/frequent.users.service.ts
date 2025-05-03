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
      const result = await lastValueFrom(
        this.UserClient.send({ cmd: 'getAllUsers' }, {}),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const result = await lastValueFrom(
        this.UserClient.send({ cmd: 'getUser' }, memberNumber),
      );

      return result;
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
      const result = await lastValueFrom(
        this.UserClient.send(
          { cmd: 'updateCountry' },
          { newCountry: newData.newCountry, memberNumber: memberNumber },
        ),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateName({
    memberNumber,
    newName,
  }: {
    memberNumber: number;
    newName: NewData;
  }): Promise<PersonalizedResponse | void> {
    try {
      const result = await lastValueFrom(
        this.UserClient.send(
          { cmd: 'updateName' },
          { newName: newName, memberNumber: memberNumber },
        ),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

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
      const result = await lastValueFrom(
        this.UserClient.send(
          { cmd: 'handleNameUpdate' },
          { memberNumber, id, accept },
        ),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
