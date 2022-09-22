import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginRequestDto } from './dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // đây cũng là default
    super({ usernameField: 'username', passwordField: 'password' });
  }

  // kết quả sẽ được gán vào biến user của req => truy cập: req.user
  async validate(username: string, password: string): Promise<UserDto> {
    const loginRequestDto: LoginRequestDto = { username, password };
    const user: User = await this.authService.validateUser(loginRequestDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
