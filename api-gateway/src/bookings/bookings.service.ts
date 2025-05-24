import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

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
}
