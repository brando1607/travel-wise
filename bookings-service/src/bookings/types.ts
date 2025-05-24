export type Coordinates = {
  name: string;
  location: { lat: number; lng: number };
};

export type Itinerary = {
  origin: string;
  destination: string;
};

export type Availability = {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
};
