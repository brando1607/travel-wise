import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FrequentUsersController } from './frequent-users/frequent.users.controller';
import { FrequentUsersService } from './frequent-users/frequent.users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
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
      {
        name: 'FREQUENT-USERS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8000 },
      },
    ]),
    PassportModule,
  ],
  controllers: [FrequentUsersController, AuthController],
  providers: [FrequentUsersService, AuthService],
})
export class AppModule {}
