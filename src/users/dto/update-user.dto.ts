import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
// import {
//   IsNumber,
//   IsOptional,
//   IsString,
//   IsEmail,
//   IsNotEmpty,
//   IsEnum,
// } from 'class-validator';
// import { Role } from '../entities/role.enum';

// export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   password: string;

//   @IsOptional()
//   @IsString()
//   @IsNotEmpty()
//   fullName: string;

//   @IsOptional()
//   @IsEmail()
//   email: string;

//   @IsOptional()
//   @IsNumber()
//   age: number;

//   @IsOptional()
//   @IsEnum(Role)
//   role: string;
// }
// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username'] as const),
) {}
