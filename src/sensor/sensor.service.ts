import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload, Subscribe } from 'nest-mqtt';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Sensor } from './entities/sensor.entity';
const logger: Logger = new Logger('sensor.services.ts');
@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async getAllSensorDataDb(query) {
    try {
      const sensors: Sensor[] = await this.sensorRepository.find({
        where: {
          ...query,
          sort: { createdAt: 'asc' },
        },
      });
      return sensors;
    } catch (error) {
      logger.error('getAllSensorDataDb: ' + error);
    }
  }

  async insertDataSensorDb(createSensorDto: CreateSensorDto) {
    try {
      const rs: Sensor = await this.sensorRepository.save({
        ...createSensorDto,
      });
      return rs;
    } catch (error) {
      logger.error('insertDataSensorDb: ' + error);
    }
  }

  @Subscribe({
    topic: 'smart_home_humidity_and_temperature',
  })
  async receiveMessageMqtt(@Payload() payload: any) {
    try {
      const { humidityAir, temperature } = payload;
      const rs: Sensor = await this.insertDataSensorDb({
        humidityAir,
        temperature,
      });
      if (!rs) logger.error('error when receiveMessageMqtt');
    } catch (error) {
      logger.error('receiveMessageMqtt: ' + error);
    }
  }
}
