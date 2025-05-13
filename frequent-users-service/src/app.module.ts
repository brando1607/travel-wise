import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FrequentUsersModule } from './frequent-users/frequent.users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, FrequentUsersModule, ClientsModule.register([])],
})
export class AppModule {}
