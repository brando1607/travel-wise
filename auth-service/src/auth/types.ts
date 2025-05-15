enum Status {
  ACTIVE,
  BLOCKED,
  INACTIVE,
  SUSPENDED,
}

type Users = {
  memberNumber: number;
  name: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  country: string;
  status: Status;
  bookings: string[];
};

export type UpdatedUser = Partial<Users>;

export type NewUser = Omit<Users, 'memberNumber'>;

export type PersonalizedResponse = {
  message: string;
  statusCode: number;
  data?: any;
};

export type Login = string | number;

export type Response = {
  result: boolean;
  message?: string;
  data?: any;
};

export type TokenData = {
  memberNumber: number;
  lastName: string;
  country: string;
};

export type isEmailFunction = {
  cmd: string;
};
