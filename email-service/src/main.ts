import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'email_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  console.log(`Email service connected to RabbitMQ`);
}
bootstrap();
