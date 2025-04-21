import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewUser, UserData } from './types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private UserClient: ClientProxy,
    @Inject('AUTH-SERVICE') private AuthClient: ClientProxy,
  ) {}

  async register(userData: UserData): Promise<NewUser> {
    try {
      const { password, ...userWithoutPassword } = userData;
      const createUser = await lastValueFrom(
        this.UserClient.send({ cmd: 'createUser' }, userWithoutPassword),
      );

      const memberNumber = createUser.data.memberNumber;

      //add password to db

      await lastValueFrom(
        this.AuthClient.send(
          { cmd: 'addPassword' },
          { memberNumber, password },
        ),
      );

      return createUser;
    } catch (error) {
      throw error;
    }
  }
}
