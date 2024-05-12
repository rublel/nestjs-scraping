import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SWAGGER } from './config/documentation/swagger.constants';
import * as basicAuth from 'express-basic-auth';
import { generateSwaggerApi } from './config/documentation';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.use([`${SWAGGER.ROUTE}`], basicAuth(SWAGGER.AUTH));

  generateSwaggerApi({
    app,
    appConfig: {
      env: process.env.NODE_ENV || 'dev',
      port: process.env.PORT,
      prefix: 'api/v1',
    },
  });
  await app.listen(process.env.PORT || 3000);

  Logger.verbose(
    `
Environment: ${process.env.NODE_ENV || 'dev'}
Server running on: http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
