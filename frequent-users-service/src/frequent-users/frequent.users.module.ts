import { Module } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FrequentUsersController } from './frequent.users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [FrequentUsersService],
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'AUTH-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8800 },
      },
      {
        name: 'EMAIL-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'email_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [FrequentUsersController],
})
export class FrequentUsersModule {}
