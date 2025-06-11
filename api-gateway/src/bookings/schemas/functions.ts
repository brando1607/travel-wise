import z from 'zod';
import { member, phone, email, cabin } from './user.schema';

type Cabin = z.infer<typeof cabin>;
type Member = z.infer<typeof member>;
type Phone = z.infer<typeof phone>;
type Email = z.infer<typeof email>;

export const validateMembers = (obj: Member[]) => {
  try {
    const memberArray = z.array(member);
    return memberArray.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

export const validatePhoneNumber = (obj: Phone) => {
  try {
    return phone.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

export const validateEmail = (obj: Email) => {
  try {
    return email.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

export const validateCabin = (obj: Cabin) => {
  try {
    return cabin.safeParse(obj);
  } catch (error) {
    throw error;
  }
};
