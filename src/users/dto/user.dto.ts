import { IsString, IsNumber, IsDefined } from 'class-validator';

export class UserDto {
  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsNumber()
  @IsDefined()
  age?: number;

  @IsString()
  email: string;
}
