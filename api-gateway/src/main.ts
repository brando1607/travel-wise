import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { port } from './utils/port.utils';
import { CustomFilter } from './utils/custom.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: port },
  });

  await app.startAllMicroservices();

  app.useGlobalFilters(new CustomFilter());

  await app.listen(port ?? 3000, () => {
    console.log(`Api gateway listening on port http://localhost:${port}`);
  });
}
bootstrap();
