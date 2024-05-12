import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SWAGGER } from './config/swagger/swagger.constants';
import * as basicAuth from 'express-basic-auth';
import { generateSwaggerApi } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

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
}
bootstrap();
