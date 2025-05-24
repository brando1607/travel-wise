import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';

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
  }): Promise<number | void> {
    try {
      const result = await this.bookingsService.getAvailabilityWithAirportCode({
        origin,
        destination,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }
}
