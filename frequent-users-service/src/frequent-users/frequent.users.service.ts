import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { User, PartialUser } from './types';

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
    newData: PartialUser;
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
}
