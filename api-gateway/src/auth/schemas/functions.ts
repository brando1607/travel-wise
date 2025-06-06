import z from 'zod';
import { email, member } from './user.schemas';

type Email = z.infer<typeof email>;
type Member = z.infer<typeof member>;

export const validateEmail = (obj: Email) => {
  try {
    return email.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

export const validateMember = (obj: Member) => {
  try {
    return member.safeParse(obj);
  } catch (error) {
    throw error;
  }
};
