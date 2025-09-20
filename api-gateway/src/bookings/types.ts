export type Itinerary = {
  couponNumber?: number;
  fare?: number;
  date: string;
  origin: string;
  destination: string;
  cabin: string;
};

type Outbound = Itinerary;
type Inbound = Itinerary;

export type SaveRoundTrip = {
  ob: { id: number } & Outbound;
  ib: { id: number } & Inbound;
};

export type Search = { flights: [Outbound] } | { flights: [Outbound, Inbound] };

export type DataValidation = {
  result: boolean;
  data: {
    couponNumber?: number;
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

export type UpdatePassengerData = {
  bookingCode: string;
  data: true;
  userdata: {
    name?: string;
    lastName?: string;
    dateOfBirh?: string;
    country?: string;
  };
};

export type UpdateFlights = {
  data: false;
  bookingCode: string;
  flights: Itinerary[];
};

export type ConfirmCouponChange = {
  coupon: number;
  bookingCode: string;
};
