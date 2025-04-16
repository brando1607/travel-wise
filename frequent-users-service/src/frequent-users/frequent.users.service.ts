import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatedUser, NewUser, PersonalizedResponse } from './types';
import { encryption } from 'src/utils/encryptAndDecrypt.function';
import { errors } from 'src/utils/dictionaries/errors.dictionary';
import { responses } from 'src/utils/dictionaries/responses.distionary';
import { CustomError } from 'src/utils/custom.errors';
import { CustomResponse } from 'src/utils/custom.response';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FrequentUsersService {
  constructor(private db: PrismaService) {}

  async getAllUsers(): Promise<PersonalizedResponse | void> {
    try {
      const users = await this.db.users.findMany();

      if (users.length === 0) {
        return {
          message: responses.noData.message,
          statusCode: responses.noData.statusCode,
        };
      }

      return CustomResponse.newResponse({ ...responses.success, data: users });
    } catch (error) {
      return error;
    }
  }

  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const user = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!user)
        throw new RpcException({
          message: errors.notFound.user.message,
          statusCode: errors.notFound.user.statusCode,
        });

      return { ...responses.success, data: user };
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
      const userExists = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!userExists) {
        return CustomError.newError(responses.noData);
      }

      const updatedUser = await this.db.users.update({
        where: { memberNumber: memberNumber },
        data: newData,
      });

      return CustomResponse.newResponse({
        ...responses.success,
        data: updatedUser,
      });
    } catch (error) {
      return error;
    }
  }

  async createUser({
    user,
    email,
  }: {
    user: NewUser;
    email: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const userExists = await this.db.users.findFirst({
        where: { email: email },
      });

      if (userExists) {
        return CustomError.newError(errors.conflict);
      }

      let newMemberNumber = 0;

      const getMemberNumbers = await this.db.users.findMany({
        select: { memberNumber: true },
        orderBy: { memberNumber: 'desc' },
        take: 1,
      });

      if (getMemberNumbers.length === 0) {
        newMemberNumber = 2000;
      } else {
        newMemberNumber = getMemberNumbers[0].memberNumber + 1;
      }

      const encryptedEmail = encryption.encrypt(email);

      const newMemberData = {
        memberNumber: newMemberNumber,
        email: encryptedEmail,
        ...user,
      };

      const newUser = await this.db.users.create({ data: newMemberData });

      return CustomResponse.newResponse({
        ...responses.success,
        data: newUser,
      });
    } catch (error) {
      return error;
    }
  }
}
