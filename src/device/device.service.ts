import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
const logger: Logger = new Logger('device.services.ts');
import { topicMqtt } from 'src/config/configuration';
import { MqttService } from 'nest-mqtt';
@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @Inject(MqttService) private readonly mqttService: MqttService,
  ) {}

  // get all devices
  async getAllDevicesDb(query: any): Promise<Device[]> | undefined {
    try {
      const devices: Device[] = await this.deviceRepository.findBy(query);
      return devices;
    } catch (error) {
      logger.error('getAllDevicesDb: ' + error);
    }
  }

  // get one device
  async getDeviceDb(query: any): Promise<Device | undefined> {
    try {
      const device: Device = await this.deviceRepository.findOneBy(query);
      return device;
    } catch (error) {
      logger.error('getDevice: ' + error);
    }
  }

  // create new device
  async createDeviceDb(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device | undefined> {
    try {
      const rs: Device = await this.deviceRepository.save({
        userId,
        ...createDeviceDto,
      });
      return rs;
    } catch (error) {
      logger.error('createDeviceDb: ' + error);
    }
  }

  // update device
  async updateDeviceDb(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device | undefined> {
    try {
      const deviceForEdit: Device = await this.deviceRepository.findOneBy({
        id,
      });
      if (deviceForEdit) {
        deviceForEdit.status = updateDeviceDto?.status;
        const rs: Device = await this.deviceRepository.save(deviceForEdit);
        const message: MqttMessageControlDevice = {
          deviceId: id,
          status: updateDeviceDto.status,
        };
        this.mqttService.publish(topicMqtt.smart_home_control_device, message);
        return rs;
      }
    } catch (error) {
      logger.error('updateDeviceDb: ' + error);
    }
  }

  // delete device
  async deleteDeviceDb(id: string): Promise<DeleteResult | undefined> {
    try {
      const result = await this.deviceRepository.delete(id);
      if (result.affected == 1) return result;
    } catch (error) {
      logger.error('deleteDeviceDb: ' + error);
    }
  }
}
