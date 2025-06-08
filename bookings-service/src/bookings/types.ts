export type Coordinates = {
  name: string;
  location: { lat: number; lng: number };
};

export type Itinerary = {
  origin: string;
  destination: string;
};

export type Availability = {
  id: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: number;
};

export type PersonalizedResponse = {
  message: string;
  statusCode: number;
  data?: any;
};

type PersonalInfo = {
  frequentUser?: boolean;
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
