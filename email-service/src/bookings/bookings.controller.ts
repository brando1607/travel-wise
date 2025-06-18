import { Controller } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @EventPattern({ cmd: 'bookingCreated' })
  async bookingCreated(booking: any): Promise<void> {
    try {
      await this.bookingsService.bookingCreated(booking);
    } catch (error) {
      throw error;
    }
  }
}
