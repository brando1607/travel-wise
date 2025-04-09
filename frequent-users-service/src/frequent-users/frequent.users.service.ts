import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { User, UpdatedUser, NewUser } from './types';
import { encryption } from 'src/utils/encryptAndDecrypt.function';

@Injectable()
export class FrequentUsersService {
  constructor(
    @Inject('BOOKINGS-SERVICE') private client: ClientProxy,
    private db: PrismaService,
  ) {}

  async getAllUsers(): Promise<User[] | string> {
    try {
      const users = await this.db.users.findMany();

      if (users.length === 0) return 'No frequent users yet.';

      return users;
    } catch (error) {
      return error;
    }
  }

  async getUser(memberNumber: number): Promise<User | string> {
    try {
      const user = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!user) return 'User not found';

      return user;
    } catch (error) {
      return error;
    }
  }

  async updateUser({
    memberNumber,
    newData,
  }: {
    memberNumber: number;
    newData: UpdatedUser;
  }): Promise<User | string> {
    try {
      const userExists = await this.db.users.findFirst({
        where: { memberNumber: memberNumber },
      });

      if (!userExists) return 'User not found.';

      const updatedUser = await this.db.users.update({
        where: { memberNumber: memberNumber },
        data: newData,
      });

      return updatedUser;
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
  }): Promise<User | string> {
    try {
      const userExists = await this.db.users.findFirst({
        where: { email: email },
      });

      if (userExists) return 'User already exists.';

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

      return newUser;
    } catch (error) {
      return error;
    }
  }
}
