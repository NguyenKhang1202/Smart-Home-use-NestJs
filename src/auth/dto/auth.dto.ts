import { IsString, IsDefined, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/users/entities/role.enum';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
