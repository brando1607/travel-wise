import { Injectable } from '@nestjs/common';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { Booking } from './types';

@Injectable()
export class BookingsService {
  constructor(private readonly mail: NodemailerService) {}

  async bookingCreated(booking: Booking): Promise<void> {
    try {
      const passengers = booking.passengers
        .map((p, index) => {
          const dob = p.dateOfBirth.slice(0, 10);
          let memberNumber =
            p.memberNumber === 'undefined' ? 'Not a member' : p.memberNumber;

          return `Passenger ${index + 1}:
                  Name: ${p.name} ${p.lastName}
                  Member Number: ${memberNumber}
                  Date of Birth: ${dob}
                  Country: ${p.country}
    `;
        })
        .join('\n');

      const itinerary = booking.itinerary
        .map((e) => {
          return `
                    Flight number: ${e.transportId}
                    Origin ${e.origin}:
                    Destination: ${e.destination}
                    Departure: ${e.departure}
                    Arrival: ${e.arrival}
                    Flight duration: ${e.duration} hours
                    Price: ${e.price}
      `;
        })
        .join('\n');

      const text = `Dear passenger,
      
      We are delighted to inform you your booking was confirmed under the following code: ${booking.bookingCode}.
      
      The details are the following:
      
      Passengers:
      
      ${passengers}
      
      Itinerary:
      
      ${itinerary}
      
      Contact information:
      
      ${booking.email} ${booking.phoneNumber}
      
      The current status is ${booking.status}. So please contact us as soon as possible to complete the payment.`;

      const subject = `Your booking ${booking.bookingCode} is confirmed!`;

      //send email

      await this.mail.sendEmail({ email: booking.email, text, subject });
    } catch (error) {
      throw error;
    }
  }
}
