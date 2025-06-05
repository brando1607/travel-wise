import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Itinerary } from './types';
import { BookingsService } from './bookings.service';
import { PersonalizedResponse, Availability, Passenger } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('getAvailabilityAC')
  async getAvailabilityWithAirportCode(
    @Body() data: Itinerary,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { origin, destination } = data;

      const response =
        await this.bookingsService.getAvailabilityWithAirportCode({
          origin,
          destination,
        });

      return { statusCode: 200, data: response };
    } catch (error) {
      throw error;
    }
  }

  @Post('saveAvailability')
  async saveAvailability(
    @Body() data: Availability,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { id, origin, destination } = data;

      const response = await this.bookingsService.saveAvailability({
        id,
        origin,
        destination,
      });

      return { statusCode: 200, data: response };
    } catch (error) {
      throw error;
    }
  }

  @Post('saveUserInfo')
  async saveUserInfo(
    @Body() userData: Passenger,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.saveUserInfo(userData);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
