import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8800 },
      },
      {
        name: 'BOOKINGS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8080 },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
