import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
const logger: Logger = new Logger('Main');
async function bootstrap() {
  const appOptions = { cors: true };
  // const opts = new NestApplicationOptions();
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

  // use Swagger
  const config = new DocumentBuilder()
    .setTitle('Smart Home use NestJS')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('App listening on port 3000');
}
bootstrap();
