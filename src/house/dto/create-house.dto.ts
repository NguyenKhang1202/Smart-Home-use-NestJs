import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateHouseDto {
  @IsNumber()
  @IsDefined()
  numberHouse: number;

  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  address: string;
}
