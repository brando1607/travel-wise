export type Coordinates = {
  name: string;
  location: { lat: number; lng: number };
};

export type Availability = {
  date: string;
  flights: FlightInformation[];
};

export type OneWay = { oneWay: true } & Availability;

export type RoundTrip = {
  oneWay: false;
  ob: FlightInformation;
  ib: FlightInformation;
};

export type Flights = OneWay | RoundTrip;

type OneWayBooking = {
  oneWay: true;
  date: string;
  flights: FlightInformation;
  price: number;
  passenger: PersonalInfo[];
  email: string;
  phoneNumber: string;
};

type RoundTripBooking = {
  oneWay: false;
  passenger: PersonalInfo[];
  email: string;
  phoneNumber: string;
  ob: FlightInformation;
  ib: FlightInformation;
  priceOutbound: number;
  priceInbound: number;
  totalPrice: number;
};

export type BookingOverview = OneWayBooking | RoundTripBooking;

export type Itinerary = {
  date: string;
  origin: string;
  destination: string;
  cabin: 'economy' | 'premium' | 'business';
};

export type RoundTripData = {
  flights: [Itinerary, Itinerary];
  fare: { outBound: number; inBound: number };
};

export type AvailabilityRoundTrip = {
  flights: { ob: Availability; ib: Availability };
};

type FlightInformation = {
  transportId: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: number;
  cabin: string;
  price: number;
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

export type SaveRoundTrip = {
  ob: { id: number } & Itinerary;
  ib: { id: number } & Itinerary;
};
