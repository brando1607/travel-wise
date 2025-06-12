import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [
    NodemailerModule,
    ClientsModule.register([
      {
        name: 'BOOKINGSS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8080 },
      },
    ]),
  ],
})
export class BookingsModule {}
