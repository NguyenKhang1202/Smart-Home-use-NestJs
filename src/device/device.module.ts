import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import * as moment from 'moment';
// import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DeviceController],
  providers: [
    DeviceService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
})
export class DeviceModule {}
