import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8800 },
      },
      {
        name: 'FREQUENT-USERS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8000 },
      },
      {
        name: 'BOOKINGS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8080 },
      },
    ]),
  ],
})
export class BookingsModule {}
