import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
} from '@nestjs/common';
import { Itinerary } from './types';
import { BookingsService } from './bookings.service';
import { PersonalizedResponse, Availability, Passenger, Search } from './types';
import {
  validateMembers,
  validateEmail,
  validatePhoneNumber,
  validateCabin,
  validateDate,
} from './schemas/functions';
import { DateTime } from 'luxon';
import { validateDateFormatAndCabin } from 'src/utils/utility.functions';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('getAvailabilityAC')
  async getAvailabilityWithAirportCode(
    @Body() data: Search,
  ): Promise<PersonalizedResponse | void> {
    try {
      if (data.flights.length === 1) {
        //check cabin and date format
        const validation = validateDateFormatAndCabin(data);

        if (validation.result) {
          const response =
            await this.bookingsService.getAvailabilityWithAirportCode({
              date: validation.data.date,
              origin: validation.data.origin,
              destination: validation.data.destination,
              fare: validation.data.fare + 0.04, //fare slighly increased for one way trips
              cabin: validation.data.cabin,
            });

          return response;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('saveAvailability')
  async saveAvailability(
    @Body() data: Availability,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { id } = data;
      const cabin = data.cabin.toLocaleLowerCase();
      const origin = data.origin.toLocaleLowerCase();
      const destination = data.destination.toLocaleLowerCase();

      const response = await this.bookingsService.saveAvailability({
        id,
        origin,
        destination,
        cabin,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('saveUserInfo')
  async saveUserInfo(
    @Body() userData: Passenger,
  ): Promise<PersonalizedResponse | void> {
    try {
      const nonUsers = userData.passenger
        .filter((e) => !e.frequentUser)
        .map((e) => [{ name: e.name, lastName: e.lastName }])
        .flat();

      if (nonUsers.length > 0) {
        const namesCheck = validateMembers(nonUsers);

        if (!namesCheck.success) {
          throw new HttpException(namesCheck.error.errors[0].message, 400);
        }
      }

      const emailCheck = validateEmail({ email: userData.email });
      const phoneCheck = validatePhoneNumber({
        phoneNumber: userData.phoneNumber,
      });

      if (!emailCheck.success) {
        throw new HttpException(emailCheck.error.errors[0].message, 400);
      }

      if (!phoneCheck.success) {
        throw new HttpException(phoneCheck.error.errors[0].message, 400);
      }

      const response = await this.bookingsService.saveUserInfo(userData);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('bookingOverview')
  async bookingOverview(): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.bookingOverview();

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('createBooking')
  async createBooking(): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.createBooking();

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('getBookings')
  async getBookings(): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.getBookings();

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get('getBooking/:code')
  async getBooking(
    @Param() code: string,
  ): Promise<PersonalizedResponse | void> {
    try {
      const response = await this.bookingsService.getBooking(
        code.toUpperCase(),
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
