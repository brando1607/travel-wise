import z from 'zod';

const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

const email = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type Email = z.infer<typeof email>;
type Member = z.infer<typeof member>;

export const validateEmail = (obj: Email) => {
  try {
    return email.safeParse(obj);
  } catch (error) {
    throw error;
  }
};

const member = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: "Name can't have numbers or special characters.",
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
      message: "Name can't have numbers or special characters.",
    }),
});

export const validateMember = (obj: Member) => {
  try {
    return member.safeParse(obj);
  } catch (error) {
    throw error;
  }
};
