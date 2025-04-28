export type User = {
  name: string;
  memberNumber: number;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  country: string;
  bookings: string[];
};

export type PersonalizedResponse = {
  message?: string;
  statusCode?: number;
  data?: any;
};

export type UpdatedUser = Partial<User>;

export type NewData = {
  newFirstName?: string;
  newLastName?: string;
  newCountry?: string;
};

export type TokenData = {
  memberNumber: number;
  lastName: string;
  country: string;
};
