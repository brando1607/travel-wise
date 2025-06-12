export type Result = { result: boolean };

type Availability = {
  transportId: number;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: number;
  cabin: string;
  price: string;
};

type PersonalInfo = {
  frequentUser?: boolean;
  memberNumber: number | string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
};

export type Booking = {
  passengers: PersonalInfo[];
  email: string;
  phoneNumber: string;
  itinerary: Availability[];
  bookingCode: string;
  status: string;
};
