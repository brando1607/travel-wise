import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import {
  PersonalizedResponse,
  Passenger,
  RoundTripData,
  SaveRoundTrip,
} from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @MessagePattern({ cmd: 'getAvailabilityOneWay' })
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
      const response = await this.bookingsService.getAvailabilityOneWay({
        date,
        origin,
        destination,
        fare,
        cabin,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'getAvailabilityRoundTrip' })
  async getAvailabilityRoundTrip(
    data: RoundTripData,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.bookingsService.getAvailabilityRoundTrip(data);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'saveAvailabilityOneWay' })
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
      const response = this.bookingsService.saveAvailabilityOneWay({
        id,
        origin,
        destination,
        cabin,
        date,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'saveAvailabilityRoundTrip' })
  async saveAvailabilityRoundTrip(
    data: SaveRoundTrip,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.saveAvailabilityRoundTrip(data);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'saveUserInfo' })
  async saveUserInfo(
    userData: Passenger,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.saveUserInfo(userData);

      return response;
    } catch (error) {
      throw error;
    }
  }
  @MessagePattern({ cmd: 'bookingOverview' })
  async bookingOverview(): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.bookingOverview();

      return response;
    } catch (error) {
      throw error;
    }
  }
  @MessagePattern({ cmd: 'createBooking' })
  async createBooking(): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.createBooking();

      return response;
    } catch (error) {
      throw error;
    }
  }
  @MessagePattern({ cmd: 'getBookings' })
  async getBookings(): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.getBookings();

      return response;
    } catch (error) {
      throw error;
    }
  }
  @MessagePattern({ cmd: 'getBooking' })
  async getBooking(payload: {
    code: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const { code } = payload;
      const response = await this.bookingsService.getBooking(code);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
