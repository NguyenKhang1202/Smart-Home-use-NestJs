import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
export function setupPassportLocal(app: INestApplication): any {
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
}
