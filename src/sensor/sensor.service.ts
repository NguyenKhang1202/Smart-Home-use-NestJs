import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload, Subscribe } from 'nest-mqtt';
import { Repository } from 'typeorm';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { Sensor } from './entities/sensor.entity';
import { getAppFirebase } from 'src/config/firebase.config';
import * as admin from 'firebase-admin';
const logger: Logger = new Logger('sensor.services.ts');
@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  async getDataSensorDb(): Promise<Sensor | undefined> {
    try {
      const sensor: Sensor[] = await this.sensorRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
      return sensor[0];
    } catch (error) {
      logger.error('getDataSensorDb: ' + error);
    }
  }
  async getAllSensorDataDb() {
    try {
      const sensors: Sensor[] = await this.sensorRepository.find({
        order: { createdAt: 'DESC' },
      });
      return sensors;
    } catch (error) {
      logger.error('getAllSensorDataDb: ' + error);
    }
  }

  async insertDataSensorDb(createSensorDto: CreateSensorDto) {
    try {
      // write data to database local
      const rs: Sensor = await this.sensorRepository.save({
        ...createSensorDto,
      });
      this.writeUserData({ ...createSensorDto });
      return rs;
    } catch (error) {
      logger.error('insertDataSensorDb: ' + error);
    }
  }

  // receive message from Mqtt broker
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

  // write data to the firebase database realtime
  async writeUserData({ humidityAir, temperature }) {
    const app = await getAppFirebase();
    const db = admin.database(app);
    await db.ref('/sensors').push({ humidityAir, temperature });
  }
}
