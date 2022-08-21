import { IsString, IsNumber, IsDefined, IsEnum } from 'class-validator';
import { Role } from '../entities/role.enum';

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

  @IsEnum(Role)
  role: string;
}
