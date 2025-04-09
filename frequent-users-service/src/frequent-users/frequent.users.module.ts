import { Module } from '@nestjs/common';
import { FrequentUsersService } from './frequent.users.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({ providers: [FrequentUsersService], imports: [PrismaModule] })
export class FrequentUsersModule {}
