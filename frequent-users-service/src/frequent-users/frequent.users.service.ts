import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatedUser, NewUser, PersonalizedResponse } from './types';
import { encryption } from 'src/utils/encryptAndDecrypt.function';
import { errors } from 'src/utils/dictionaries/errors.dictionary';
import { responses } from 'src/utils/dictionaries/responses.distionary';
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

      return { ...responses.success, data: users };
    } catch (error) {
      throw error;
    }
  }

  async getUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const user = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!user) {
        throw new RpcException({
          message: errors.notFound.user.message,
          statusCode: errors.notFound.user.statusCode,
        });
      }

      return { ...responses.success, data: user };
    } catch (error) {
      throw error;
    }
  }

  async getUserEmail(email: string): Promise<PersonalizedResponse | void> {
    try {
      const emailExists = await this.db.users.findFirst({
        where: { email: email },
      });

      if (!emailExists) {
        throw new RpcException({
          message: errors.notFound.email.message,
          statusCode: errors.notFound.email.statusCode,
        });
      }

      return { ...responses.success, data: emailExists };
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
        throw new RpcException({
          message: errors.notFound.user.message,
          statusCode: errors.notFound.user.statusCode,
        });
      }

      const updatedUser = await this.db.users.update({
        where: { memberNumber: memberNumber },
        data: newData,
      });

      return { ...responses.success, data: updatedUser };
    } catch (error) {
      throw error;
    }
  }

  async createUser({
    user,
  }: {
    user: NewUser;
  }): Promise<PersonalizedResponse | void> {
    try {
      const userExists = await this.db.users.findFirst({
        where: { email: user.email },
      });

      if (userExists) {
        throw new RpcException({
          message: errors.conflict.message,
          statusCode: errors.conflict.statusCode,
        });
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

      //encrypt user's email
      user.email = encryption.encrypt(user.email);

      const newMemberData = {
        memberNumber: newMemberNumber,
        ...user,
      };

      const newUser = await this.db.users.create({ data: newMemberData });

      return { ...responses.success, data: newUser };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(memberNumber: number): Promise<PersonalizedResponse | void> {
    try {
      const userExists = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!userExists) {
        throw new RpcException({
          message: errors.notFound.user.message,
          statusCode: errors.notFound.user.statusCode,
        });
      }

      //delete user
      await this.db.users.delete({
        where: { memberNumber: memberNumber },
      });

      return {
        message: responses.noData.message,
        statusCode: responses.noData.statusCode,
      };
    } catch (error) {
      throw error;
    }
  }
}
