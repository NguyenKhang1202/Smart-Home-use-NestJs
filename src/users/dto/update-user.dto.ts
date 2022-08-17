import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
