import z from 'zod';
import parsePhoneNumberFromString from 'libphonenumber-js';

const nameRegex = /^[a-zA-Z\s]+$/;
const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

export const member = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, 'Name must be at least 3 characters long')
    .max(20, 'Name must be at most 20 characters long')
    .regex(nameRegex, {
      message: "Name can't have numbers or special characters.",
    }),
  lastName: z
    .string({
      required_error: 'Last name is required',
    })
    .min(2, 'Last name must be at least 3 characters long')
    .max(20, 'Last name must be at most 20 characters long')
    .regex(nameRegex, {
      message: "Last name can't have numbers or special characters.",
    }),
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

export const cabin = z.object({
  cabin: z.enum(['economy', 'premium', 'business'], {
    message: 'Cabin must be economy, premium or business',
  }),
});

export const date = z.object({
  date: z.string().regex(dateRegex, {
    message: 'Correct format for date is DD-MM-YYYY',
  }),
});
