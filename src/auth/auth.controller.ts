import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/security/guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import apiResponse from 'src/utils/api.response';
import { Response } from 'express';
import { APIStatus } from 'src/config/constants';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import hashPassword from 'src/utils/hash.password';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @UseGuards(LocalAuthGuard) // chỉ khi login mới gán user cho request
  // username và password được LocalAuthGuard xử lý
  async login(@Req() req: Request) {
    return await this.authService.login(req);
  }

  @ApiOperation({ summary: 'Register user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async registerNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerNewUser(createUserDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<ApiResponse | any> {
    if (changePasswordDto.oldPassword == changePasswordDto.newPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        apiResponse({
          status: APIStatus.FAILURE,
          message: 'Old password and new password cannot be same',
          data: null,
        }),
      );
    }
    const id: string = req.user.id;
    const user: User = await this.usersService.getUserDb({ id });
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        apiResponse({
          status: APIStatus.FAILURE,
          message: 'Old password is wrong',
          data: null,
        }),
      );
    }

    const hashedPass: string = await hashPassword(
      changePasswordDto.newPassword,
    );
    const rs = await this.authService.changePasswordDb(user, hashedPass);
    if (rs) {
      return res.status(HttpStatus.OK).json(
        apiResponse({
          status: APIStatus.SUCCESS,
          message: 'Change password success',
          data: null,
        }),
      );
    }

    throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
