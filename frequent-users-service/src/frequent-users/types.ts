import { Users } from '@prisma/client';

export type User = Users;

export type UpdatedUser = Partial<Users>;

export type NewUser = Omit<Users, 'memberNumber'>;

export type PersonalizedResponse = {
  message: string;
  statusCode: number;
  data?: any;
};
