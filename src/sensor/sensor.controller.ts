import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { APIStatus } from 'src/config/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/security/decorators/auth.decorator';
import { Role } from 'src/users/entities/role.enum';
import { Sensor } from './entities/sensor.entity';

@ApiTags('devices')
@Auth(Role.USER)
@Controller('/api/v1/sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @ApiOperation({ summary: 'Get all data sensors' })
  @ApiResponse({
    status: 200,
    description: 'Get list of data sensors success!',
  })
  @Get()
  async getAllSensorData(): Promise<APIResponse<Sensor[]> | undefined> {
    const rs = await this.sensorService.getAllSensorDataDb({});
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get list of data sensors successfully',
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

  @ApiOperation({ summary: 'Create data sensor' })
  @ApiResponse({ status: 201, description: 'Create data sensor' })
  @Post()
  async insertDataSensor(
    @Body() createSensorDto: CreateSensorDto,
    @Req() req: Request | any,
  ): Promise<APIResponse<Sensor> | undefined> {
    const userId: string = req?.user?.userId;
    const rs = await this.sensorService.insertDataSensorDb(
      userId,
      createSensorDto,
    );
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get list of data sensors successfully',
        data: rs,
      };
    }
  }
}
