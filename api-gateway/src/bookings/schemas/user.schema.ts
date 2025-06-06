import z from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';

export const member = z.object({
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

export const phone = z.object({
  phoneNumber: z.string().refine(
    (phoneNumber) => {
      const phone = parsePhoneNumberFromString(phoneNumber);
      return phone?.isValid() ?? false;
    },
    { message: 'Invalid phone number' },
  ),
});

export const email = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});
