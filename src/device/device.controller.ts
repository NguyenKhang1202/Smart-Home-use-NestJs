import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  Logger,
  Req,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIStatus } from 'src/config/constants';
import { Auth } from 'src/security/decorators/auth.decorator';
import { Role } from 'src/users/entities/role.enum';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
const logger: Logger = new Logger('device.controller.ts');
import * as moment from 'moment';
import { topicMqtt } from 'src/config/configuration';
@ApiTags('devices')
// @Auth(Role.USER)
@Controller('/api/v1/devices')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService, // private readonly mqttService: MqttService,
  ) {}

  @ApiOperation({ summary: 'Get all devices' })
  @ApiResponse({ status: 200, description: 'Get list of devices success!' })
  @Get()
  async getAllDevices(
    @Query('roomId') roomId: string,
  ): Promise<APIResponse<Device[]> | undefined> {
    const devices: Device[] = await this.deviceService.getAllDevicesDb({
      roomId,
    });
    if (devices) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get list of devices successfully',
        data: devices,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Get one device' })
  @ApiResponse({ status: 200, description: 'Get device success!' })
  @Get(':id')
  async getDevice(
    @Param('id') id: string,
  ): Promise<APIResponse<Device> | undefined> {
    const device: Device = await this.checkDeviceId(id);
    if (device) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get device success',
        data: device,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Create device' })
  @ApiResponse({ status: 201, description: 'Create device success!' })
  @Post()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
    @Req() req: Request | any,
  ): Promise<APIResponse<Device> | undefined> {
    const userId = req?.user?.id;
    const isDeviceExist: Device = await this.deviceService.getDeviceDb({
      deviceName: createDeviceDto.deviceName,
      userId,
    });
    if (isDeviceExist) {
      throw new HttpException(
        {
          status: APIStatus.FAILURE,
          message: 'Device is already exist',
        },
        HttpStatus.CONFLICT,
      );
    }
    const device: Device = await this.deviceService.createDeviceDb(
      userId,
      createDeviceDto,
    );
    if (device) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Create device successfully',
        data: device,
      };
    }
    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Update device' })
  @ApiResponse({ status: 200, description: 'Update device success!' })
  @Put(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<APIResponse<Device> | undefined> {
    await this.checkDeviceId(id);
    const rs: Device | undefined = await this.deviceService.updateDeviceDb(
      id,
      updateDeviceDto,
    );
    if (rs) {
      // const message: MqttMessageControlDevice = {
      //   deviceId: id,
      //   status: updateDeviceDto.status,
      // };
      // this.mqttService.publish(topicMqtt.smart_home_control_device, message);
      return {
        status: APIStatus.SUCCESS,
        message: 'Update device successfully',
        data: rs,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Delete device' })
  @ApiResponse({ status: 200, description: 'Delete device success!' })
  @Delete(':id')
  async deleteDevice(
    @Param('id') id: string,
  ): Promise<APIResponse<null> | undefined> {
    await this.checkDeviceId(id);
    const rs = await this.deviceService.deleteDeviceDb(id);
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Delete device success',
        data: null,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async checkDeviceId(deviceId: string): Promise<Device | any> {
    try {
      const rs: Device = await this.deviceService.getDeviceDb({ id: deviceId });
      if (rs) return rs;
      else {
        throw new HttpException(
          {
            status: APIStatus.ERROR,
            message: `Incorrect device id or you don't have this device`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      logger.error('checkDeviceId: ' + error);
    }
  }

  // async getMeterPowerByDay(
  //   status: string,
  //   userId: string,
  //   device: Device,
  // ): Promise<void> {
  //   const dateNow: string = moment().format('YYYY-MM-DD');
  //   // const meter_power = await MeterPower.findOne({ userId }).sort({
  //   //   dateTime: -1,
  //   // });
  // }
}
