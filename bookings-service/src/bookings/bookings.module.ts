import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { getEnv } from 'src/utils/getEnv';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { Keyv } from '@keyv/redis';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [BookingsService],
  controllers: [BookingsController],
  imports: [
    PrismaModule,
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        const redisStore = createKeyv(getEnv('REDIS_URL'));

        try {
          await redisStore.set('__test__', 'ok', 1000);
          const testVal = await redisStore.get('__test__');
          if (testVal === 'ok') {
            console.log('Redis connected.');
          }
        } catch (err) {
          console.error('Redis connection error: ', err);
        }
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            redisStore,
          ],
        };
      },
    }),
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
  ],
})
export class BookingsModule {}
