import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // đây cũng là default
    super({ usernameField: 'username', passwordField: 'password' });
  }

  // kết quả sẽ được gán vào req
  async validate(username: string, pass: string): Promise<UserDto> {
    const user: User = await this.authService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...userDto } = user;
    return userDto;
  }
}
