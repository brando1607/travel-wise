import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Coordinates,
  Availability,
  PersonalizedResponse,
  Passenger,
  Booking,
} from 'src/bookings/types';
import tzLookup from 'tz-lookup';
import { DateTime } from 'luxon';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { errors } from 'src/utils/dictionaries/errors.dictionary';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingsService {
  private readonly googleApiKey = process.env.GOOGLE_API_KEY;
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('FREQUENT-USERS-SERVICE') private userClient: ClientProxy,
    @Inject('EMAIL-SERVICE') private emailClient: ClientProxy,
    private db: PrismaService,
  ) {}

  private calculateFlightDistance({
    lat1,
    lon1,
    lat2,
    lon2,
  }: {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
  }): number {
    try {
      const toRad = (value: number) => (value * Math.PI) / 180;

      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.ceil(R * c);
    } catch (error) {
      throw error;
    }
  }

  private async getAirportCoordinates(code: string): Promise<Coordinates> {
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            query: `${code} airport`,
            key: this.googleApiKey,
          },
        }),
      );

      const result = response.data.results[0];
      return {
        name: result.name,
        location: result.geometry.location,
      };
    } catch (error) {
      throw error;
    }
  }

  private calculateFlightSpeed(distance: number): number {
    try {
      if (distance <= 300) return 600;
      if (distance <= 1000) return 750;
      return 900;
    } catch (error) {
      throw error;
    }
  }

  private calculateTimeDifference({
    originsCoordinates,
    destinationsCoordinates,
  }: {
    originsCoordinates: Coordinates;
    destinationsCoordinates: Coordinates;
  }): number {
    try {
      const timezoneOrigin = tzLookup(
        originsCoordinates.location.lat,
        originsCoordinates.location.lng,
      );
      const timezoneDestination = tzLookup(
        destinationsCoordinates.location.lat,
        destinationsCoordinates.location.lng,
      );

      const originTime = DateTime.now().setZone(timezoneOrigin);
      const destinationTime = DateTime.now().setZone(timezoneDestination);
      const difference = Math.round(destinationTime.hour - originTime.hour);

      return difference;
    } catch (error) {
      throw error;
    }
  }

  private getLatestDeparturetime({
    arrivalLimit,
    flightTime,
    timeDifference,
  }: {
    arrivalLimit: number;
    flightTime: number;
    timeDifference: number;
  }): number {
    try {
      const rawDeparture = arrivalLimit - flightTime - timeDifference;
      return (rawDeparture + 24) % 24;
    } catch (error) {
      throw error;
    }
  }

  private formatTime(time: number): string {
    try {
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      const paddedHours = String((hours + 24) % 24).padStart(2, '0');
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${paddedHours}:${paddedMinutes}`;
    } catch (error) {
      throw error;
    }
  }

  async getAvailabilityWithAirportCode({
    origin,
    destination,
    fare,
    cabin,
  }: {
    origin: string;
    destination: string;
    fare: number;
    cabin: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const cachedData = await this.cacheManager.get<Availability[]>(
        `origin:${origin}/destination:${destination}/cabin:${cabin}`,
      );

      if (cachedData) {
        return { message: 'Availability', statusCode: 200, data: cachedData };
      }

      let arrivalLimit = 19;
      const [originsCoordinates, destinationsCoordinates] = await Promise.all([
        this.getAirportCoordinates(origin),
        this.getAirportCoordinates(destination),
      ]);
      const distance = this.calculateFlightDistance({
        lat1: originsCoordinates.location.lat,
        lon1: originsCoordinates.location.lng,
        lat2: destinationsCoordinates.location.lat,
        lon2: destinationsCoordinates.location.lng,
      });

      const speed = this.calculateFlightSpeed(distance);

      const flightTime = Math.round((distance / speed + 0.5) * 2) / 2;
      const timeDifference = this.calculateTimeDifference({
        originsCoordinates,
        destinationsCoordinates,
      });

      const latestDepartureTime = this.getLatestDeparturetime({
        arrivalLimit,
        flightTime,
        timeDifference,
      });

      let availability: Availability[] = [];

      for (let i = 0; i < 3; i++) {
        const departure = latestDepartureTime - i;
        const arrival = arrivalLimit - i;
        let priceIncrease = 1;

        if (i === 1) {
          priceIncrease = 1.15;
        } else if (i === 2) {
          priceIncrease = 1.25;
        }

        availability.push({
          transportId: i,
          origin,
          destination,
          departure: this.formatTime(departure),
          arrival: this.formatTime(arrival),
          duration: flightTime,
          cabin: cabin,
          price: `${Math.ceil(distance * fare * priceIncrease)} USD`,
        });
      }

      await this.cacheManager.set(
        `origin:${origin}/destination:${destination}/cabin:${cabin}`,
        availability,
        300000,
      );

      return { message: 'Availability', statusCode: 200, data: availability };
    } catch (error) {
      throw error;
    }
  }

  async saveAvailability({
    id,
    origin,
    destination,
    cabin,
  }: {
    id: number;
    origin: string;
    destination: string;
    cabin: string;
  }): Promise<PersonalizedResponse | void> {
    try {
      const cachedData = await this.cacheManager.get<Availability[]>(
        `origin:${origin}/destination:${destination}/cabin:${cabin}`,
      );

      if (!cachedData) {
        throw new RpcException({
          statusCode: errors.notFound.availability.statusCode,
          message: errors.notFound.availability.message,
        });
      }

      const availability = cachedData.filter((e) => e.transportId === id);

      //save availability in cache for 5 minutes

      await this.cacheManager.set(`savedAvailability`, availability, 300000);

      return {
        message: 'Availability saved.',
        statusCode: 200,
        data: availability,
      };
    } catch (error) {
      throw error;
    }
  }

  async saveUserInfo(userData: Passenger): Promise<PersonalizedResponse> {
    try {
      const frequentUsers = userData.passenger
        .filter((e) => e.frequentUser)
        .map((e) => e.memberNumber);

      if (frequentUsers.length > 0) {
        const getFrequentUsersData = await lastValueFrom(
          this.userClient.send({ cmd: 'getUsers' }, frequentUsers),
        );

        if (getFrequentUsersData.statusCode === 404) {
          throw new RpcException({
            message: getFrequentUsersData.message,
            statusCode: getFrequentUsersData.statusCode,
          });
        }

        const notFrequentUsers = userData.passenger.filter(
          (e) => !e.frequentUser,
        );

        const users = {
          passenger: [...getFrequentUsersData, ...notFrequentUsers],
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        };

        await this.cacheManager.set(`passengerInformation`, users, 300000);

        return {
          message: 'Passenger(s) saved.',
          statusCode: 200,
          data: users,
        };
      } else {
        await this.cacheManager.set(`passengerInformation`, userData, 300000);

        return {
          message: 'Passenger(s) saved.',
          statusCode: 200,
          data: userData,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  async bookingOverview(): Promise<PersonalizedResponse | void> {
    try {
      const availability =
        await this.cacheManager.get<Availability>('savedAvailability');
      const passengers = await this.cacheManager.get<Passenger>(
        'passengerInformation',
      );

      if (!availability) {
        throw new RpcException({
          statusCode: errors.notFound.availability.statusCode,
          message: errors.notFound.availability.message,
        });
      }

      if (!passengers) {
        throw new RpcException({
          statusCode: errors.notFound.passengerInfo.statusCode,
          message: errors.notFound.passengerInfo.message,
        });
      }

      const booking = {
        availability,
        passengers,
      };

      //save booking in cache

      await this.cacheManager.set('bookingOverview', booking, 300000);

      return { message: 'Booking Overview', statusCode: 200, data: booking };
    } catch (error) {
      throw error;
    }
  }
  async createBooking(): Promise<PersonalizedResponse | void> {
    try {
      //generate booking reference
      const characters = '23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let bookingCode = '';
      let newBookingCode = false;

      const bookingData =
        await this.cacheManager.get<Booking>('bookingOverview');

      if (!bookingData) {
        throw new RpcException({
          statusCode: errors.notFound.booking.statusCode,
          message: errors.notFound.booking.message,
        });
      }

      while (!newBookingCode) {
        bookingCode = '';

        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);

          bookingCode += characters[randomIndex];
        }

        const checkBookingCode = await this.db.bookings.findFirst({
          where: { bookingCode: bookingCode },
        });

        if (!checkBookingCode) {
          newBookingCode = true;
        }
      }

      const booking = {
        passengers: bookingData.passengers.passenger,
        email: bookingData.passengers.email,
        phoneNumber: bookingData.passengers.phoneNumber,
        itinerary: bookingData.availability,
        bookingCode,
      };

      //check if there are frequent users
      const frequentUsers = booking.passengers
        .filter((e) => typeof e.memberNumber === 'number')
        .map((e) => e.memberNumber);

      if (frequentUsers.length > 0) {
        //add booking to frequent user

        const data = {
          bookingCode,
          frequentUsers,
        };

        await lastValueFrom(
          this.userClient.send({ cmd: 'addBookingCodeInFrequentUser' }, data),
        );
      }

      // add booking to db
      const newBooking = await this.db.bookings.create({ data: booking });

      // send email with booking

      await lastValueFrom(
        this.emailClient.emit({ cmd: 'bookingCreated' }, newBooking),
      );

      return {
        message: `Booking created under code ${bookingCode}`,
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
  async getBookings(): Promise<PersonalizedResponse | void> {
    try {
      const currentBookings = await this.db.bookings.findMany();

      if (currentBookings.length < 1) {
        throw new RpcException({
          statusCode: errors.notFound.bookings.statusCode,
          message: errors.notFound.bookings.message,
        });
      }

      return {
        message: 'Bookings retrieved',
        statusCode: 200,
        data: currentBookings,
      };
    } catch (error) {
      throw error;
    }
  }

  async getBooking(code: string): Promise<PersonalizedResponse | void> {
    try {
      const booking = await this.db.bookings.findFirst({
        where: { bookingCode: code },
      });

      if (!booking) {
        throw new RpcException({
          statusCode: errors.notFound.bookingCode.statusCode,
          message: errors.notFound.bookingCode.message,
        });
      }

      return { message: 'Booking found.', statusCode: 200, data: booking };
    } catch (error) {
      throw error;
    }
  }
}
