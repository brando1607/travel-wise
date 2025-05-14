import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NewUser, UserData, TokenData, Result } from './types';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private UserClient: ClientProxy,
    @Inject('AUTH-SERVICE') private AuthClient: ClientProxy,
    @Inject('EMAIL-SERVICE') private EmailClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(userData: UserData): Promise<NewUser> {
    try {
      const { password, ...user } = userData;

      const createUser = await lastValueFrom(
        this.UserClient.send({ cmd: 'createUser' }, user),
      );

      const memberNumber = createUser.data.memberNumber;

      //add password to db

      await lastValueFrom(
        this.AuthClient.send(
          { cmd: 'addPassword' },
          { memberNumber, password },
        ),
      );

      //send email confirmation
      await lastValueFrom(
        this.EmailClient.send(
          { cmd: 'welcomeEmail' },
          { email: user.email, memberNumber },
        ),
      );

      return createUser;
    } catch (error) {
      throw error;
    }
  }

  async login({
    token,
    tokenData,
  }: {
    token: boolean;
    tokenData: TokenData;
  }): Promise<Result> {
    if (token) throw new HttpException('User already logged in.', 400);

    const payload = {
      memberNumber: tokenData.memberNumber,
      lastName: tokenData.lastName,
      country: tokenData.country,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { statusCode: 200, message: accessToken };
  }

  async sendTemporaryPassword(login: string | number): Promise<Result> {
    try {
      await lastValueFrom(
        this.AuthClient.send({ cmd: 'sendTemporaryPassword' }, login),
      );

      return {
        statusCode: 200,
        message: 'Temporary password sent in an email.',
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword({
    memberNumber,
    tempPass,
    newPass,
  }: {
    memberNumber: number;
    tempPass: string;
    newPass: string;
  }): Promise<Result> {
    try {
      const result = await lastValueFrom(
        this.AuthClient.send(
          { cmd: 'changePassword' },
          { memberNumber, tempPass, newPass },
        ),
      );

      if (!result.result) {
        throw new HttpException(result.message, result.statusCode);
      }

      return { statusCode: 201, message: result.message };
    } catch (error) {
      throw error;
    }
  }
}
