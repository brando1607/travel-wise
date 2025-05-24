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
import { PersonalizedResponse } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async getAvailabilityWithAirportCode(
    @Body() data: Itinerary,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { origin, destination } = data;

      const result = await this.bookingsService.getAvailabilityWithAirportCode({
        origin,
        destination,
      });

      return { statusCode: 200, data: result };
    } catch (error) {
      throw error;
    }
  }
}
