import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { FrequentUsersController } from './frequent-users/frequent.users.controller';
import { FrequentUsersService } from './frequent-users/frequent.users.service';

@Module({
  imports: [PrismaModule, ClientsModule.register([])],
  controllers: [FrequentUsersController],
  providers: [FrequentUsersService],
})
export class AppModule {}
