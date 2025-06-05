import z from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';

const member = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: "Name can't have numbers or special characters.",
    })
    .min(2, 'Name must be at least 3 characters long')
    .max(20, 'Name must be at most 20 characters long'),
  lastName: z
    .string({
      required_error: 'Last name is required',
      invalid_type_error: "Last name can't have numbers or special characters.",
    })
    .min(2, 'Last name must be at least 3 characters long')
    .max(20, 'Last name must be at most 20 characters long'),
});

const phone = z.object({
  phoneNumber: z.string().refine(
    (phoneNumber) => {
      const phone = parsePhoneNumberFromString(phoneNumber);
      return phone?.isValid() ?? false;
    },
    { message: 'Invalid phone number' },
  ),
});

const email = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type Member = z.infer<typeof member>;
type Phone = z.infer<typeof phone>;
type Email = z.infer<typeof email>;

export const validateMember = (obj: Member) => {
  try {
    return member.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

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
