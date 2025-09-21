import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import {
  PersonalizedResponse,
  Passenger,
  RoundTripData,
  SaveRoundTrip,
  UpdatePassengerData,
  UpdateFlights,
  ConfirmCouponChange,
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

  @MessagePattern({ cmd: 'getPassengers' })
  async getPassengers(): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.getPassengers();

      return response;
    } catch (error) {
      throw error;
    }
  }
  @MessagePattern({ cmd: 'getBooking' })
  async getBooking(payload: string): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.getBooking(payload);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'modifyPassengerData' })
  async modifyPassengerData(
    newData: UpdatePassengerData,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.modifyPassengerData(newData);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'modifyFlights' })
  async modifyFlights(
    newData: UpdateFlights,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = this.bookingsService.modifyFlights(newData);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'confirmChange' })
  async confirmChange(
    data: ConfirmCouponChange,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.confirmChange(data);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
