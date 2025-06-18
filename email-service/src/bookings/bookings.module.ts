import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [NodemailerModule],
})
export class BookingsModule {}
