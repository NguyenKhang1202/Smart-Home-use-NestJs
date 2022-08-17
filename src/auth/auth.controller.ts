import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginDto) {
    console.log('login auth');
    return await this.authService.login(loginDto);
  }

  // @Post('register')
  // register(@Body() registerDto: RegisterDto) {
  //   return this.authService.register(registerDto);
  // }
}
