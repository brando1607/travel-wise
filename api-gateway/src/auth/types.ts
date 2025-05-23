type Users = {
  memberNumber: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  country: string;
};

export type UpdatedUser = Partial<Users>;

export type NewUser = Omit<Users, 'memberNumber' | 'password'>;

export type UserData = Omit<Users, 'memberNumber'>;

export type PersonalizedResponse = {
  message?: string;
  statusCode?: number;
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

export type Result = { statusCode: number; message: string };

export type Payload = {
  sub: number;
  lastName: string;
  country: string;
};

export type ChangePassword = {
  tempPass: string;
  newPass: string;
  login: string | number;
};
