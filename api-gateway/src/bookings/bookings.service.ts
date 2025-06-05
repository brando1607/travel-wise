import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PersonalizedResponse, Passenger } from './types';

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
      const response = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'getAvailabilityWithAirportCode' },
          { origin, destination },
        ),
      );

      return response;
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
      const response = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'saveAvailability' },
          { id, origin, destination },
        ),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async saveUserInfo(
    userData: Passenger,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send({ cmd: 'saveUserInfo' }, userData),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
