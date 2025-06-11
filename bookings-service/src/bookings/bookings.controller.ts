import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import { PersonalizedResponse, Passenger } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @MessagePattern({ cmd: 'getAvailabilityWithAirportCode' })
  async getAvailabilityWithAirportCode({
    origin,
    destination,
    fare,
    cabin,
  }: {
    origin: string;
    destination: string;
    fare: number;
    cabin: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const response =
        await this.bookingsService.getAvailabilityWithAirportCode({
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

  @MessagePattern({ cmd: 'saveAvailability' })
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
      const response = this.bookingsService.saveAvailability({
        id,
        origin,
        destination,
      });

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
