export type Itinerary = {
  date: string;
  origin: string;
  destination: string;
  cabin: 'economy' | 'premium' | 'business';
};

type Outbound = Itinerary;
type Inbound = Itinerary;

export type Search = { flights: [Outbound] } | { flights: [Outbound, Inbound] };

export type DataValidation = {
  result: boolean;
  data: {
    date: string;
    origin: string;
    destination: string;
    fare: number;
    cabin: string;
  };
};

export type RoundTripData = {
  flights: [Outbound, Inbound];
  fare: { outBound: number; inBound: number };
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
