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
        name: 'FREQUENT-USERS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8000 },
      },
      {
        name: 'EMAIL-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8300 },
      },
    ]),
  ],
  controllers: [FrequentUsersController],
})
export class FrequentUsersModule {}
