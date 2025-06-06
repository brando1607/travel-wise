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
} from './schemas/functions';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post('getAvailabilityAC')
  async getAvailabilityWithAirportCode(
    @Body() data: Itinerary,
  ): Promise<PersonalizedResponse | void> {
    try {
      const { origin, destination } = data;

      const response =
        await this.bookingsService.getAvailabilityWithAirportCode({
          origin,
          destination,
        });

      return { statusCode: 200, data: response };
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

      return { statusCode: 200, data: response };
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
        console.log(namesCheck);

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
}
