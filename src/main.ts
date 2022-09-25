import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { setupPassportLocal } from './config/local-passport';
import { setupSwagger } from './config/swagger';
import { LoggingInterceptor } from './client/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './middlewares/http-exception.filter';
const logger: Logger = new Logger('Main');
async function bootstrap() {
  // setup Cors
  const appOptions = {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  };
  const app = await NestFactory.create(AppModule, appOptions);

  // setup Validate
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // kiểm soát DTO nhận từ client
      exceptionFactory: (error): BadRequestException =>
        new BadRequestException(error),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new LoggingInterceptor());

  setupPassportLocal(app);

  setupSwagger(app);

  await app.listen(4000);
  logger.log('App listening on port 4000');
  // logger.warn('App listening on port 3000');
  // logger.error('App listening on port 3000');
  // logger.debug('App listening on port 3000');
  // logger.verbose('App listening on port 3000');
}
bootstrap();
