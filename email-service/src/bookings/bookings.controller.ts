import { Controller } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Booking } from './types';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @EventPattern({ cmd: 'bookingCreated' })
  async bookingCreated(@Payload() data: { booking: Booking }): Promise<void> {
    try {
      await this.bookingsService.bookingCreated(data);
    } catch (error) {
      throw error;
    }
  }
}
