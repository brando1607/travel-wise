import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { port } from './utils/port.utils';
import { CustomInterceptor } from './utils/custom.interceptor';
import { RpcFilter } from './utils/rpc.exception.filter';
import { HttpFilter } from './utils/http.exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: port },
  });

  app.useGlobalFilters(new RpcFilter(), new HttpFilter());
  app.useGlobalInterceptors(new CustomInterceptor());

  microservice.useGlobalFilters(new RpcFilter(), new HttpFilter());
  microservice.useGlobalInterceptors(new CustomInterceptor());

  await app.startAllMicroservices();

  app.use(cookieParser());

  await app.listen(port ?? 3000, () => {
    console.log(`Api gateway listening on port http://localhost:${port}`);
  });
}
bootstrap();
