import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/orm.config';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      envFilePath: [, '.env.development', '.env', '.env.production'],
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
