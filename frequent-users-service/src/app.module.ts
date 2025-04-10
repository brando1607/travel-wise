import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ClientsModule.register([])],
  controllers: [],
  providers: [],
})
export class AppModule {}
