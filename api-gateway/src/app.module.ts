import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FrequentUsersController } from './frequent-users/frequent.users.controller';
import { FrequentUsersService } from './frequent-users/frequent.users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport-strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { getEnv } from './utils/getEnv';
import * as dotenv from 'dotenv';
dotenv.config();

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
    JwtModule.register({
      global: true,
      secret: getEnv('TOKEN'),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [FrequentUsersController, AuthController],
  providers: [FrequentUsersService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
