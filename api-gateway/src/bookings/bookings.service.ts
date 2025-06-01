import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { last, lastValueFrom } from 'rxjs';
import { PersonalizedResponse } from './types';

@Injectable()
export class BookingsService {
  constructor(@Inject('BOOKINGS-SERVICE') private bookingClient: ClientProxy) {}

  async getAvailabilityWithAirportCode({
    origin,
    destination,
  }: {
    origin: string;
    destination: string;
  }): Promise<number | void> {
    try {
      const result = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'getAvailabilityWithAirportCode' },
          { origin, destination },
        ),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async saveAvailability({
    id,
    origin,
    destination,
  }: {
    id: number;
    origin: string;
    destination: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const result = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'saveAvailability' },
          { id, origin, destination },
        ),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
