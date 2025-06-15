import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StrategiesModule } from 'src/passport-strategies/strategies.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { getEnv } from 'src/utils/getEnv';
import { forwardRef } from '@nestjs/common';

@Module({
  providers: [AuthService],
  exports: [ClientsModule],
  controllers: [AuthController],
  imports: [
    forwardRef(() => StrategiesModule),
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
        name: 'EMAIL-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'email_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: getEnv('TOKEN'),
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
