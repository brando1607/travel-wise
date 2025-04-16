import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';

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
  controllers: [],
  providers: [],
})
export class AppModule {}
