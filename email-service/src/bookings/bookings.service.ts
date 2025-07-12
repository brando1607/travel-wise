import { Injectable } from '@nestjs/common';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { PersonalInfo, BookingOverview } from './types';

@Injectable()
export class BookingsService {
  constructor(private readonly mail: NodemailerService) {}

  private getPassengers(data: PersonalInfo[]): string[] {
    try {
      return data.map((p, index) => {
        const dob = p.dateOfBirth.slice(0, 10);
        let memberNumber =
          p.memberNumber === undefined ? 'Not a member' : p.memberNumber;

        return `Passenger ${index + 1}:
                  Name: ${p.name} ${p.lastName}
                  Member Number: ${memberNumber}
                  Date of Birth: ${dob}
                  Country: ${p.country}
    `;
      });
    } catch (error) {
      throw error;
    }
  }

  private getItinerary(data: BookingOverview): string {
    try {
      if (data.oneWay) {
        const flight = data.itinerary;
        const itinerary = `
                    Flight number: ${flight.transportId}
                    Origin: ${flight.origin}
                    Destination: ${flight.destination}
                    Departure: ${flight.departure}
                    Arrival: ${flight.arrival}
                    Flight duration: ${flight.duration} hours
                    Price: ${flight.price}
      `;

        return itinerary;
      } else {
        const outboud = data.itinerary.outbound;

        const inboud = data.itinerary.inbound;

        const itinerary = `
                  Outbound:
                    Flight number: ${outboud.transportId}
                    Origin: ${outboud.origin} 
                    Destination: ${outboud.destination}
                    Departure: ${outboud.departure}
                    Arrival: ${outboud.arrival}
                    Flight duration: ${outboud.duration} hours
                    Price: ${data.itinerary.priceOutbound}
                  Inbound:
                    Flight number: ${inboud.transportId}
                    Origin: ${inboud.origin} 
                    Destination: ${inboud.destination}
                    Departure: ${inboud.departure}
                    Arrival: ${inboud.arrival}
                    Flight duration: ${inboud.duration} hours
                    Price: ${data.itinerary.priceInbound} 
                  Total price: ${data.itinerary.totalPrice}

      `;

        return itinerary;
      }
    } catch (error) {
      throw error;
    }
  }

  async bookingCreated(data: { booking: BookingOverview }): Promise<void> {
    try {
      const { booking } = data;
      const passengers = this.getPassengers(booking.passengers);

      const itinerary = this.getItinerary(booking);

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
