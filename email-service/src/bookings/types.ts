type Availability = {
  transportId: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: number;
  cabin: string;
  price: number;
};

export type Passenger = {
  passenger: PersonalInfo[];
  email: string;
  phoneNumber: string;
};

export type PersonalInfo = {
  frequentUser?: boolean;
  memberNumber: number | string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
};

type OneWayBooking = {
  oneWay: true;
  passengers: PersonalInfo[];
  email: string;
  phoneNumber: string;
  itinerary: Availability;
  bookingCode: string;
  status: string;
};

type RoundTripBooking = {
  oneWay: false;
  passengers: PersonalInfo[];
  email: string;
  phoneNumber: string;
  itinerary: {
    outbound: Availability;
    inbound: Availability;
    priceInbound: number;
    priceOutbound: number;
    totalPrice: number;
  };
  bookingCode: string;
  status: string;
};

export type BookingOverview = OneWayBooking | RoundTripBooking;
