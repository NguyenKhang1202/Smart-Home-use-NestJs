import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../entities/role.enum';
// default trong class DTO là các field sẽ là optional
// Để biến nó thành bắt buộc thì thêm trường @Is...()
// Để biến nó thành có thể null nhưng nếu có thì phải theo format
// dùng : @IsOptional() + @Is...()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
