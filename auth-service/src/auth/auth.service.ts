import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Login, Response, TokenData } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private client: ClientProxy,
    private readonly db: PrismaService,
  ) {}

  async addPassword({
    memberNumber,
    password,
  }: {
    memberNumber: number;
    password: string;
  }): Promise<Response> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      //add data into db
      await this.db.passwords.create({
        data: { password: hashedPassword, memberNumber: memberNumber },
      });

      return { result: true };
    } catch (error) {
      throw error;
    }
  }

  async validLogin({
    username,
    password,
  }: {
    username: Login;
    password: string;
  }): Promise<Response> {
    try {
      const loginIsMemberNumber = typeof username === 'number' ? true : false;
      let validLogin = false;
      let memberNumber: number;
      let tokenData: TokenData;

      if (loginIsMemberNumber) {
        const validMemberNumber = await lastValueFrom(
          this.client.send({ cmd: 'getUser' }, username),
        );

        if (validMemberNumber.statusCode === 404) {
          return { result: validLogin, message: 'Invalid login or password' };
        }

        memberNumber = validMemberNumber.data.memberNumber;

        tokenData = {
          memberNumber: validMemberNumber.data.memberNumber,
          lastName: validMemberNumber.data.lastName,
          country: validMemberNumber.data.country,
        };
      } else {
        const userEmail = await lastValueFrom(
          this.client.send({ cmd: 'getUserEmail' }, username),
        );

        if (userEmail.statusCode === 404) {
          return { result: validLogin, message: 'Invalid login or password' };
        }

        memberNumber = userEmail.data.memberNumber;

        tokenData = {
          memberNumber: userEmail.data.memberNumber,
          lastName: userEmail.data.lastName,
          country: userEmail.data.country,
        };
      }

      const currentPassword = await this.db.passwords.findFirst({
        select: { password: true },
        where: { memberNumber: memberNumber },
      });

      if (!currentPassword)
        return { result: false, message: 'Invalid login or password' };

      const validPassword = await bcrypt.compare(
        password,
        currentPassword.password,
      );

      if (!validPassword) {
        return { result: validLogin, message: 'Invalid login or password' };
      }

      validLogin = true;

      return {
        result: validLogin,
        message: 'Successfull login.',
        data: tokenData,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateTempPassword({
    memberNumber,
    tempPass,
    newPass,
  }: {
    memberNumber: number;
    tempPass: string;
    newPass: string;
  }): Promise<Response> {
    try {
      const temporaryPassword = await this.db.passwords.findFirst({
        select: { tempPassword: true, timeStamp: true },
        where: { memberNumber: memberNumber },
      });

      if (
        temporaryPassword === null ||
        temporaryPassword.tempPassword === null ||
        temporaryPassword.timeStamp === null
      )
        return { result: false };

      if (Math.ceil(Date.now() / 1000 - temporaryPassword.timeStamp) > 120) {
        //remove temporary password and timestamp

        await this.db.passwords.update({
          where: { memberNumber },
          data: { tempPassword: null, timeStamp: null },
        });

        return {
          result: false,
          message: 'Password expired, request a new one.',
        };
      }

      const hashedPassword = await bcrypt.hash(tempPass, 10);

      const validPassword = await bcrypt.compare(
        hashedPassword,
        temporaryPassword.tempPassword,
      );

      if (!validPassword) {
        //remove temporary password and timestamp

        await this.db.passwords.update({
          where: { memberNumber },
          data: { tempPassword: null, timeStamp: null },
        });

        return {
          result: false,
          message: 'Invalid temporary password.',
        };
      }

      const newPassword = await bcrypt.hash(newPass, 10);

      //update password

      await this.db.passwords.update({
        where: { memberNumber: memberNumber },
        data: { password: newPassword },
      });

      return {
        result: true,
        message: 'Password updated.',
      };
    } catch (error) {
      throw error;
    }
  }

  async emailNotInUse(email: string): Promise<Response> {
    try {
      const validEmail = await lastValueFrom(
        this.client.send({ cmd: 'getUserEmail' }, email),
      );

      if (validEmail.statusCode === 404) {
        return { result: false, message: 'Email not found' };
      }

      return { result: true };
    } catch (error) {
      throw error;
    }
  }
}
