import { IsDefined, IsString } from 'class-validator';

export class CreateHomeDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  address: string;
}
