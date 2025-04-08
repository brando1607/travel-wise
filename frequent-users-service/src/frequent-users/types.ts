import { Users } from '@prisma/client';

export type User = Users;

export type UpdatedUser = Partial<Users>;
