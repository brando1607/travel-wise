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

export type NameUpdate = {
  newFirstName: string;
  newLastName: string;
};

export type NewCountry = {
  newCountry: string;
};

export type PersonalInfo = {
  name: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
};

export type AddBookingCode = {
  bookingCode: string;
  frequentUsers: number[];
};
