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
import { PersonalizedResponse, Availability, Passenger } from './types';
import {
  validateMembers,
  validateEmail,
  validatePhoneNumber,
  validateCabin,
  validateDate,
} from './schemas/functions';
import { DateTime } from 'luxon';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('getAvailabilityAC')
  async getAvailabilityWithAirportCode(
    @Body() data: Itinerary,
  ): Promise<PersonalizedResponse | void> {
    try {
      const cabin = data.cabin.toLocaleLowerCase();
      const origin = data.origin.toLocaleLowerCase();
      const destination = data.destination.toLocaleLowerCase();
      const date = data.date;
      const dateFormat = validateDate({ date });
      const validDate = DateTime.fromFormat(date, 'dd-MM-yyyy');
      const futureDate = DateTime.now().plus({ days: 350 }).startOf('day');
      const today = DateTime.now().startOf('day');
      let fare: number;

      if (!dateFormat.success) {
        throw new HttpException(dateFormat.error.errors[0].message, 400);
      }

      if (!validDate.isValid) {
        throw new HttpException(`${date} is not a valid date.`, 400);
      }

      if (validDate < today) {
        throw new HttpException(`Date can't be before today`, 400);
      }

      if (validDate > futureDate) {
        throw new HttpException(
          `Date can't be more than 350 days in the future.`,
          400,
        );
      }

      const checkCabin = validateCabin({ cabin });

      if (!checkCabin.success) {
        throw new HttpException(checkCabin.error.errors[0].message, 400);
      }

      if (cabin === 'economy') {
        fare = 0.05;
      } else if (cabin === 'premium') {
        fare = 0.09;
      } else {
        fare = 0.14;
      }

      const response =
        await this.bookingsService.getAvailabilityWithAirportCode({
          date,
          origin,
          destination,
          fare,
          cabin,
        });

      return response;
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
