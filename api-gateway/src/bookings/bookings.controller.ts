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
} from './schemas/functions';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('getAvailabilityAC')
  async getAvailabilityWithAirportCode(
    @Body() data: Itinerary,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { origin, destination, cabin } = data;
      let fare: number;

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
      const { id, origin, destination } = data;

      const response = await this.bookingsService.saveAvailability({
        id,
        origin,
        destination,
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
      const response = await this.bookingsService.getBooking(code);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
