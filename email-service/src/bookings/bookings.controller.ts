import { Controller } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { MessagePattern } from '@nestjs/microservices';
import { Result } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @MessagePattern({ cmd: 'bookingCreated' })
  async bookingCreated(booking: any): Promise<Result | void> {
    try {
      const result = await this.bookingsService.bookingCreated(booking);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
