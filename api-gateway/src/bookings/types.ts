export type Itinerary = {
  origin: string;
  destination: string;
};

export type PersonalizedResponse = {
  message?: string;
  statusCode?: number;
  data?: any;
};
