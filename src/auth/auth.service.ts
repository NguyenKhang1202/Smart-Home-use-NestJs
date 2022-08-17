import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async login(loginDto: LoginDto) {
    // tìm username xem trùng ko
    const user = await this.validateUser(loginDto.username, loginDto.password);
    console.log(user);
    return user;
  }

  // register(registerDto: RegisterDto) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    console.log(password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
