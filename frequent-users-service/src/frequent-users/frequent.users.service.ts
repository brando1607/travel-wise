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
      const hashedEmail = encryption.hash(email);

      const emailExists = await this.db.users.findFirst({
        where: { hashedEmail: hashedEmail },
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

  async createUser(user: NewUser): Promise<PersonalizedResponse | void> {
    try {
      let rawDate: Date;

      if (typeof user.dateOfBirth === 'string') {
        // Convert to Date (assumes DD-MM-YYYY)
        let [day, month, year] = user.dateOfBirth.split(/[-/]/).map(Number);
        rawDate = new Date(year, month - 1, day);
      } else {
        rawDate = user.dateOfBirth;
      }

      const hashedEmail = encryption.hash(user.email);

      const userExists = await this.db.users.findFirst({
        where: { hashedEmail: hashedEmail },
      });

      if (userExists) {
        throw new RpcException({
          message: errors.conflict.email.message,
          statusCode: errors.conflict.email.statusCode,
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

      user.encryptedEmail = encryption.encrypt(user.email);

      //hash user's email

      user.hashedEmail = hashedEmail;

      //format date of birth
      user.dateOfBirth = rawDate;

      const newMemberData = {
        memberNumber: newMemberNumber,
        name: user.name,
        lastName: user.lastName,
        hashedEmail: user.hashedEmail,
        encryptedEmail: user.encryptedEmail,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
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

  async updateCountry({
    newCountry,
    memberNumber,
  }: {
    newCountry: UpdatedUser;
    memberNumber: number;
  }): Promise<PersonalizedResponse | void> {
    try {
      const updatedCountry = await this.db.users.update({
        where: { memberNumber: memberNumber },
        data: { country: newCountry as string },
      });

      return { ...responses.success, data: updatedCountry };
    } catch (error) {
      throw error;
    }
  }
  async updateName({
    memberNumber,
    newName,
  }: {
    memberNumber: number;
    newName: UpdatedUser;
  }): Promise<PersonalizedResponse | void> {
    try {
    } catch (error) {
      throw error;
    }
  }
}
