import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PersonalizedResponse, Passenger, RoundTripData } from './types';

@Injectable()
export class BookingsService {
  constructor(@Inject('BOOKINGS-SERVICE') private bookingClient: ClientProxy) {}

  async getAvailabilityOneWay({
    date,
    origin,
    destination,
    fare,
    cabin,
  }: {
    date: string;
    origin: string;
    destination: string;
    fare: number;
    cabin: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'getAvailabilityOneWay' },
          { origin, destination, fare, cabin, date },
        ),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAvailabilityRoundTrip(
    data: RoundTripData,
  ): Promise<PersonalizedResponse | void> {
    const response = await lastValueFrom(
      this.bookingClient.send({ cmd: 'getAvailabilityRoundTrip' }, data),
    );

    return response;
  }

  async saveAvailabilityOneWay({
    id,
    origin,
    destination,
    cabin,
    date,
  }: {
    id: number;
    origin: string;
    destination: string;
    cabin: string;
    date: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'saveAvailabilityOneWay' },
          { id, origin, destination, cabin, date },
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

  async bookingOverview(): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send({ cmd: 'bookingOverview' }, {}),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async createBooking(): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send({ cmd: 'createBooking' }, {}),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getBookings(): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send({ cmd: 'getBookings' }, {}),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
  async getBooking(code: string): Promise<PersonalizedResponse | void> {
    try {
      const response = await lastValueFrom(
        this.bookingClient.send({ cmd: 'getBooking' }, code),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
