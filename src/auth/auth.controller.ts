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
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/security/guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return await this.authService.login(req);
  }

  @ApiOperation({ summary: 'Register user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async registerNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerNewUser(createUserDto);
  }
}
