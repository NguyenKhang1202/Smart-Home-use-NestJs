import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return await this.authService.login(req);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async registerNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerNewUser(createUserDto);
  }
}
