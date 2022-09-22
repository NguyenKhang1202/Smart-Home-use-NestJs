import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Request,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginRequestDto, ChangePasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
const logger: Logger = new Logger('auth.service.ts');
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(@Req() req) {
    const user = req.user;
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerNewUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUserDb(createUserDto);
  }

  async changePasswordDb(
    user: User,
    newPassword: string,
  ): Promise<User | undefined> {
    try {
      const rs: User = await this.usersService.changePasswordDb(
        user,
        newPassword,
      );
      return rs;
    } catch (error) {
      logger.error('changePasswordDb: ' + error);
    }
  }

  async validateUser(
    loginRequestDto: LoginRequestDto,
  ): Promise<UserDto | null> {
    const user: User = await this.usersService.getUserDb({
      username: loginRequestDto.username,
    });
    if (user) {
      const isMatch = await bcrypt.compare(
        loginRequestDto.password,
        user.password,
      );
      if (isMatch) {
        const { password, ...info } = user;
        return info;
      }
    }
    return null;
  }
}
