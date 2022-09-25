import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSensorDto {
  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty()
  humidityAir: number;

  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @IsNotEmpty()
  temperature: number;
}
