import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BookingsModule, PrismaModule],
})
export class AppModule {}
