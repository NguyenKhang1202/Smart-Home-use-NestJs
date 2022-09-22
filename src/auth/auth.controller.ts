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
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/security/guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto, LoginResponseDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
// import apiResponse from 'src/utils/api.response';
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

  // login
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard) // chỉ khi login mới gán user cho request
  // username và password được LocalAuthGuard xử lý
  async login(
    @Req() req: Request,
  ): Promise<APIResponse<LoginResponseDto | any>> {
    const rs = await this.authService.login(req);
    return {
      status: APIStatus.SUCCESS,
      message: 'Login success',
      data: rs,
    };
  }

  // register
  @ApiOperation({ summary: 'Register user' })
  @Post('register')
  @HttpCode(201)
  async registerNewUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<APIResponse<User> | undefined> {
    const rs = await this.authService.registerNewUser(createUserDto);
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Register success',
        data: rs,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // change password
  @ApiOperation({ summary: 'Change password' })
  @Post('change-password')
  @HttpCode(200)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<APIResponse<null> | any> {
    if (changePasswordDto.oldPassword == changePasswordDto.newPassword) {
      throw new HttpException(
        {
          status: APIStatus.FAILURE,
          message: 'Old password and new password cannot be same',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = req?.user?.userId;
    const user = await this.usersService.getUserDb({ id: userId });
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException(
        {
          status: APIStatus.FAILURE,
          message: 'Old password is wrong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPass: string = await hashPassword(
      changePasswordDto.newPassword,
    );
    const rs = await this.authService.changePasswordDb(user, hashedPass);
    if (rs) {
      return res.status(HttpStatus.OK).json({
        status: APIStatus.SUCCESS,
        message: 'Change password success',
        data: null,
      });
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
