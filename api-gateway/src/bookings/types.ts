export type Itinerary = {
  date: string;
  origin: string;
  destination: string;
  cabin: 'economy' | 'premium' | 'business';
};

export type PersonalizedResponse = {
  message?: string;
  statusCode?: number;
  data?: any;
};

export type Availability = { id: number } & Itinerary;

type PersonalInfo = {
  frequentUser: boolean;
  memberNumber: number | string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
};

export type Passenger = {
  passenger: PersonalInfo[];
  email: string;
  phoneNumber: string;
};
