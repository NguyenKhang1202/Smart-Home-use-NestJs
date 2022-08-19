import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // kiểm soát DTO nhận từ client
      exceptionFactory: (error): BadRequestException =>
        new BadRequestException(error),
    }),
  );
  app.use(
    session({
      secret: 'SESSION_SECRET',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
