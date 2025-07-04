import { HttpException } from '@nestjs/common';
import { validateCabin, validateDate } from 'src/bookings/schemas/functions';
import { DateTime } from 'luxon';
import { DataValidation, Itinerary } from 'src/bookings/types';

export function validateDateFormatAndCabin(data: Itinerary): DataValidation {
  let fare: number = 0;
  const cabin = data.cabin.toLowerCase();
  const date = data.date;
  const origin = data.origin.toLowerCase();
  const destination = data.destination.toLowerCase();
  const dateFormat = validateDate({ date });
  const validDate = DateTime.fromFormat(date, 'dd-MM-yyyy');
  const futureDate = DateTime.now().plus({ days: 350 }).startOf('day');
  const today = DateTime.now().startOf('day');
  const checkCabin = validateCabin({ cabin });

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

  return {
    result: true,
    data: { date: date, origin, destination, fare, cabin },
  };
}

export function obIsBeforeIB(ob: string, ib: string): boolean {
  try {
    const outBound = DateTime.fromFormat(ob, 'dd-MM-yyyy');
    const inBound = DateTime.fromFormat(ib, 'dd-MM-yyyy');

    const isBefore = outBound < inBound;

    return isBefore;
  } catch (error) {
    throw error;
  }
}
