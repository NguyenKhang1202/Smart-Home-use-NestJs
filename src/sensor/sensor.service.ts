import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  // async getStatisticData(query) {
  //   const { dateBegin, dateEnd, miniRange: number } = query;

  // }

  async insertDataSensorDb(userId: string, createSensorDto: CreateSensorDto) {
    try {
      const rs = await this.sensorRepository.save({
        userId,
        ...createSensorDto,
      });
      return rs;
    } catch (error) {
      logger.error('insertDataSensorDb: ' + error);
    }
  }
}
