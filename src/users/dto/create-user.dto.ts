import { ApiProperty } from '@nestjs/swagger';
import {
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
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role, required: true })
  @IsEnum(Role)
  role: string;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  age?: number;
}
