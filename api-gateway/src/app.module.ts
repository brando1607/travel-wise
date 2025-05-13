import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FrequentUsersModule } from './frequent-users/frequent.users.module';
import { BookingsModule } from './bookings/bookings.module';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [AuthModule, FrequentUsersModule, BookingsModule, PassportModule],
})
export class AppModule {}
