import { Module } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { FrequentUsersController } from './frequent.users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [FrequentUsersService],
  controllers: [FrequentUsersController],
  imports: [
    ClientsModule.register([
      {
        name: 'FREQUENT-USERS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8000 },
      },
    ]),
  ],
})
export class FrequentUsersModule {}
