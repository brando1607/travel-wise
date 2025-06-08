export type Itinerary = {
  origin: string;
  destination: string;
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

export type Booking = {
  availability: Availability;
  passengers: Passenger;
};
