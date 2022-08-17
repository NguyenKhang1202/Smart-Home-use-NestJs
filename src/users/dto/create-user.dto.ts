import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  fullName: string;

  @IsString()
  @IsDefined()
  role: string;

  @IsNumber()
  @IsDefined()
  age?: number;
}
