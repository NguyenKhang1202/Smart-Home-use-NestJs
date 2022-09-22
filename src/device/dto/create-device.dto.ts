import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateDeviceDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  deviceName: string;

  @ApiProperty({ enum: Status, required: false })
  @IsOptional()
  @IsEnum(Status)
  status: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: 'date', required: false })
  @IsOptional()
  @IsDefined()
  startTime: Date;

  @ApiProperty({ type: 'int', required: true })
  @IsNumber()
  @IsNotEmpty()
  wattage: number;
}
