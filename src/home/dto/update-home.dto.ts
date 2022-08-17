import { PartialType } from '@nestjs/mapped-types';
import { IsDefined, IsString } from 'class-validator';
import { CreateHomeDto } from './create-home.dto';

export class UpdateHomeDto extends PartialType(CreateHomeDto) {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  address: string;
}
