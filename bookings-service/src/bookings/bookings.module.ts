import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  imports: [PrismaModule, HttpModule],
})
export class BookingsModule {}
