import { Module } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FrequentUsersController } from './frequent.users.controller';

@Module({
  providers: [FrequentUsersService],
  imports: [PrismaModule],
  controllers: [FrequentUsersController],
})
export class FrequentUsersModule {}
