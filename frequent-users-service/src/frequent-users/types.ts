type Users = {
  memberNumber: number;
  name: string;
  lastName: string;
  email: string;
  hashedEmail: string;
  encryptedEmail: string;
  dateOfBirth: Date | string;
  country: string;
};

export type UpdatedUser = Partial<Users>;

export type NewUser = Omit<Users, 'memberNumber'>;

export type PersonalizedResponse = {
  message: string;
  statusCode: number;
  data?: any;
};

export type NameUpdate = Pick<Users, 'name' | 'lastName'>;

export type NewCountry = {
  country: string;
};
