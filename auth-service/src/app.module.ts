import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'FREQUENT-USERS-SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8000 },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
