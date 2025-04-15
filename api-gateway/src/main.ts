import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { port } from './utils/port.utils';
import { CustomInterceptor } from './utils/custom.interceptor';
import { CustomExceptionFilter } from './utils/custom.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: port },
  });

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new CustomInterceptor());

  microservice.useGlobalFilters(new CustomExceptionFilter());
  microservice.useGlobalInterceptors(new CustomInterceptor());

  await app.startAllMicroservices();

  await app.listen(port ?? 3000, () => {
    console.log(`Api gateway listening on port http://localhost:${port}`);
  });
}
bootstrap();
