import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/orm.config';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './security/guard/roles.guard';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { SensorModule } from './sensor/sensor.module';
import { MqttModule } from 'nest-mqtt';
import { mqttConfig } from 'src/config/mqtt.config';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
    }),
    MqttModule.forRootAsync({
      useFactory: mqttConfig,
    }),
    UsersModule,
    AuthModule,
    RoomModule,
    DeviceModule,
    SensorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
