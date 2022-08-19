import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './create-house.dto';
import { IsNumber, IsString, IsOptional } from 'class-validator';
export class UpdateHouseDto extends PartialType(CreateHouseDto) {
  @IsNumber()
  @IsOptional()
  numberHouse: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;
}
