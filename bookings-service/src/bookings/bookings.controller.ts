import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import { Availability, PersonalizedResponse, Passenger } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @MessagePattern({ cmd: 'getAvailabilityWithAirportCode' })
  async getAvailabilityWithAirportCode({
    origin,
    destination,
  }: {
    origin: string;
    destination: string;
  }): Promise<Availability[] | void> {
    try {
      const response =
        await this.bookingsService.getAvailabilityWithAirportCode({
          origin,
          destination,
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
}
