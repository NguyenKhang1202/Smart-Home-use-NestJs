import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Request() req) {
    const user = req.user;
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async registerNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(createUserDto);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | null> {
    const user: User = await this.userService.findOneByField({
      where: { username: username },
    });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result; // UserDto
      }
    }

    return null;
  }
}
