import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
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
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost'],
          queue: 'email_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
})
export class AuthModule {}
