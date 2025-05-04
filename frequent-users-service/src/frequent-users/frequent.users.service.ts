import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpdatedUser,
  NewUser,
  PersonalizedResponse,
  NameUpdate,
  NewCountry,
} from './types';
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
    newCountry: string;
    memberNumber: number;
  }): Promise<PersonalizedResponse | void> {
    try {
      if (!newCountry) {
        throw new RpcException({
          message: errors.missing.entry.message,
          statusCode: errors.missing.entry.statusCode,
        });
      }

      const updatedCountry = await this.db.users.update({
        where: { memberNumber: memberNumber },
        data: { country: newCountry },
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
    newName: NameUpdate;
  }): Promise<PersonalizedResponse | void> {
    try {
      if (Object.keys(newName).length === 0) {
        throw new RpcException({
          message: errors.missing.entry.message,
          statusCode: errors.missing.entry.statusCode,
        });
      }

      const currentNames = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
        select: { name: true, lastName: true },
      });

      const firstNameIsDifferent = newName.newFirstName !== currentNames!.name;
      const lastNameIsDifferent =
        newName.newLastName !== currentNames!.lastName;

      if (!firstNameIsDifferent || !lastNameIsDifferent) {
        throw new RpcException({
          message: errors.missing.nameNotDifferent.message,
          statusCode: errors.missing.nameNotDifferent.statusCode,
        });
      }

      //insert into pending name changes table

      if (newName.newLastName) {
        await this.db.pending_name_changes.create({
          data: {
            memberNumber: memberNumber,
            originalLastName: currentNames!.lastName,
            newLastName: newName.newLastName,
          },
        });
      } else if (newName.newFirstName) {
        await this.db.pending_name_changes.create({
          data: {
            memberNumber: memberNumber,
            originalName: currentNames!.name,
            newName: newName.newFirstName,
          },
        });
      }

      return {
        statusCode: responses.noData.statusCode,
        message: 'Name change request sent for evaluation',
      };
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
      const pendingChange = await this.db.pending_name_changes.findFirst({
        where: { id: id },
        select: { newLastName: true, newName: true },
      });

      if (!pendingChange) {
        throw new RpcException({
          message: errors.notFound.changeRequest.message,
          statusCode: errors.notFound.changeRequest.statusCode,
        });
      }

      if (accept) {
        if (pendingChange.newLastName) {
          await this.db.users.update({
            where: { memberNumber: memberNumber },
            data: { lastName: pendingChange.newLastName },
          });
        } else if (pendingChange.newName) {
          await this.db.users.update({
            where: { memberNumber: memberNumber },
            data: { name: pendingChange.newName },
          });
        }

        //update change status

        await this.db.pending_name_changes.update({
          where: { id: id },
          data: { status: 'DONE' },
        });

        return { ...responses.success };
      } else {
        //update change status

        await this.db.pending_name_changes.update({
          where: { id: id },
          data: { status: 'REJECTED' },
        });

        return { ...errors.forbidden.nameChangeNotAllowed };
      }
    } catch (error) {
      throw error;
    }
  }
}
