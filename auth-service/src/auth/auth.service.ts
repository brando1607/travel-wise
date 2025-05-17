import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Login, Response, TokenData, FailedLogins } from './types';
import { errors } from 'src/utils/dictionaries/errors.dictionary';
import { RpcException } from '@nestjs/microservices';
import { isEmail } from 'src/utils/reusable.functions';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FREQUENT-USERS-SERVICE') private userClient: ClientProxy,
    @Inject('EMAIL-SERVICE') private emailClient: ClientProxy,
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
      const user = await lastValueFrom(
        this.userClient.send({ cmd: 'getUser' }, memberNumber),
      );

      const userName = user.data.name;

      const nameIsInPassword = password.toLowerCase().includes(userName);

      if (nameIsInPassword) {
        //delete user and throw error

        await lastValueFrom(
          this.userClient.send({ cmd: 'deleteUser' }, memberNumber),
        );

        throw new RpcException({
          statusCode: errors.badRequest.nameInPassword.statusCode,
          message: errors.badRequest.nameInPassword.message,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // add data into db
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
      let validLogin = false;
      let memberNumber: number;
      let tokenData: TokenData;

      const cmd = isEmail(username);

      const user = await lastValueFrom(this.userClient.send(cmd, username));

      if (user.statusCode === 404) {
        return {
          result: validLogin,
          message: 'Invalid login or password',
          data: { login: 'username' },
        };
      }

      memberNumber = user.data.memberNumber;

      tokenData = {
        memberNumber: user.data.memberNumber,
        lastName: user.data.lastName,
        country: user.data.country,
      };

      const currentPassword = await this.db.passwords.findFirst({
        select: { password: true },
        where: { memberNumber: memberNumber },
      });

      const validPassword = await bcrypt.compare(
        password,
        currentPassword!.password,
      );

      if (!validPassword) {
        return {
          result: validLogin,
          message: 'Invalid login or password',
          data: { login: 'password', memberNumber },
        };
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

  private async removeTemporaryPasswordAndTimestamp(
    memberNumber: number,
  ): Promise<void> {
    await this.db.passwords.update({
      where: { memberNumber },
      data: { tempPassword: null, timeStamp: null },
    });
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

      if (
        Math.ceil(Math.floor(Date.now() / 1000) - temporaryPassword.timeStamp) >
        120
      ) {
        //remove temporary password and timestamp

        await this.removeTemporaryPasswordAndTimestamp(memberNumber);

        throw new RpcException({
          message: errors.badRequest.passwordExpired.message,
          statusCode: errors.badRequest.passwordExpired.statusCode,
        });
      }

      const validPassword = tempPass === temporaryPassword.tempPassword;

      if (!validPassword) {
        throw new RpcException({
          message: errors.unauthorized.password.message,
          statusCode: errors.unauthorized.password.statusCode,
        });
      }

      //remove temporary password and timestamp

      await this.removeTemporaryPasswordAndTimestamp(memberNumber);

      return {
        result: true,
        message: 'Temporary password valid',
      };
    } catch (error) {
      throw error;
    }
  }

  async emailNotInUse(email: string): Promise<Response> {
    try {
      const validEmail = await lastValueFrom(
        this.userClient.send({ cmd: 'getUserEmail' }, email),
      );

      if (validEmail.statusCode === 404) {
        return { result: false, message: 'Email not found' };
      }

      return { result: true };
    } catch (error) {
      throw error;
    }
  }

  async sendTemporaryPassword(
    login: string | number,
  ): Promise<Response | void> {
    try {
      const tempPassword = crypto.randomBytes(10).toString('hex').slice(0, 10);

      const cmd = isEmail(login['login']);

      const user = await lastValueFrom(
        this.userClient.send(cmd, login['login']),
      );

      //send email

      await lastValueFrom(
        this.emailClient.send(
          { cmd: 'sendTemporaryPassword' },
          { email: user.data.email, tempPassword },
        ),
      );

      //store temporary password

      const memberNumber = user.data.memberNumber;
      await this.db.passwords.update({
        where: { memberNumber: memberNumber },
        data: {
          tempPassword: tempPassword,
          timeStamp: Math.floor(Date.now() / 1000),
        },
      });

      return { result: true };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode,
      });
    }
  }

  async changePassword({
    login,
    tempPass,
    newPass,
  }: {
    login: string | number;
    tempPass: string;
    newPass: string;
  }): Promise<Response> {
    try {
      const cmd = isEmail(login);

      const user = await lastValueFrom(this.userClient.send(cmd, login));

      const userName = user.data.name;

      const nameIsInPassword = newPass.toLowerCase().includes(userName);

      if (nameIsInPassword) {
        throw new RpcException({
          statusCode: errors.badRequest.nameInPassword.statusCode,
          message: errors.badRequest.nameInPassword.message,
        });
      }

      const updatePassword = await this.validateTempPassword({
        memberNumber: user.data.memberNumber,
        tempPass,
        newPass,
      });

      if (updatePassword.result) {
        //update password

        const newPassword = await bcrypt.hash(newPass, 10);

        await this.db.passwords.update({
          where: { memberNumber: user.data.memberNumber },
          data: { password: newPassword },
        });

        //send email
        await lastValueFrom(
          this.emailClient.send(
            { cmd: 'updateUser' },
            {
              email: user.data.email,
              updatedData: 'Password',
              memberNumber: user.data.memberNumber,
            },
          ),
        );

        //check if account needs to be reactivated
        const accountStatus = await lastValueFrom(
          this.userClient.send(
            { cmd: 'accountIsBlocked' },
            user.data.memberNumber,
          ),
        );

        if (accountStatus.statusCode === 403) {
          await lastValueFrom(
            this.userClient.send(
              { cmd: 'activateAccount' },
              user.data.memberNumber,
            ),
          );
        }
      }

      return {
        result: updatePassword.result,
        message: updatePassword.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFailedLogins(memberNumber: number): Promise<FailedLogins> {
    try {
      const failedAttempts = await this.db.passwords.findFirst({
        where: { memberNumber: memberNumber },
        select: { failedLogins: true },
      });

      return { attempts: failedAttempts!.failedLogins as number };
    } catch (error) {
      throw error;
    }
  }

  async increaseFailedLogins({
    memberNumber,
    failedLogins,
  }: {
    memberNumber: number;
    failedLogins: number;
  }): Promise<Response> {
    try {
      await this.db.passwords.update({
        where: { memberNumber: memberNumber },
        data: { failedLogins: failedLogins + 1 },
      });

      return { result: true };
    } catch (error) {
      throw error;
    }
  }

  async resetFailedLogins(memberNumber: number): Promise<Response> {
    try {
      await this.db.passwords.update({
        where: { memberNumber: memberNumber },
        data: { failedLogins: 0 },
      });

      return { result: true };
    } catch (error) {
      throw error;
    }
  }
}
