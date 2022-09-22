import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Logger,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  Put,
} from '@nestjs/common';
import { APIStatus } from 'src/config/constants';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import apiResponse from 'src/utils/api.response';
import { DeleteResult } from 'typeorm';
import { Response } from 'express';
import { Auth } from 'src/security/decorators/auth.decorator';
import hashPassword from 'src/utils/hash.password';
const logger: Logger = new Logger('users.controller.ts');
@ApiTags('users')
@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET all users
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get list of users success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(Role.ADMIN)
  @Get()
  async getAllUser(): Promise<ApiResponse> {
    const users: User[] = await this.usersService.getAllUserDb({});
    if (users) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get list user success',
        data: users,
      };
    }

    throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // GET one user
  @ApiOperation({ summary: 'Get one user' })
  @ApiResponse({ status: 200, description: 'Get user success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<ApiResponse> {
    const user: User = await this.usersService.getUserDb({ id });
    if (user) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get user success',
        data: user,
      };
    }

    throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // insert new user
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'Create account success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth(Role.ADMIN)
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<ApiResponse | any> {
    try {
      const isEmailExist: User | null = await this.usersService.getUserDb({
        email: createUserDto.email,
      });
      const isUsernameExist: User | null = await this.usersService.getUserDb({
        username: createUserDto.username,
      });
      if (isEmailExist) {
        return res.status(HttpStatus.CONFLICT).json({
          status: APIStatus.FAILURE,
          message: 'Email already in use',
          data: null,
        });
      }
      if (isUsernameExist) {
        return res.status(HttpStatus.CONFLICT).json({
          status: APIStatus.FAILURE,
          message: 'Username already in use',
          data: null,
        });
      }
      const hashedPass = await hashPassword(createUserDto.password);
      createUserDto.password = hashedPass;

      const user = await this.usersService.createUserDb(createUserDto);
      return res.status(HttpStatus.OK).json({
        status: APIStatus.SUCCESS,
        message: 'Insert user success',
        data: user,
      });
    } catch (error) {
      throw new HttpException(
        'Server error!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // update user info
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'Update user success!' })
  @Put(':id')
  async updateUser(
    @Param('id')
    id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<ApiResponse | any> {
    const userForEdit: User = await this.usersService.getUserDb({ id });
    if (!userForEdit) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        apiResponse({
          status: APIStatus.FAILURE,
          message: 'Incorrect account id',
          data: null,
        }),
      );
    }
    const isEmailExist: User | null = await this.usersService.getUserDb({
      email: updateUserDto.email,
    });
    if (isEmailExist && isEmailExist.id != id) {
      return res.status(HttpStatus.CONFLICT).json(
        apiResponse({
          status: APIStatus.FAILURE,
          message: 'Email is already in use.',
          data: null,
        }),
      );
    }
    const user: User = await this.usersService.updateUserDb(
      updateUserDto,
      userForEdit,
    );
    if (user) {
      return res.status(200).json(
        apiResponse({
          status: APIStatus.SUCCESS,
          message: 'Update user success',
          data: user,
        }),
      );
    }

    throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ApiOperation({ summary: 'Delete one user' })
  @ApiResponse({ status: 204, description: 'Delete user success!' })
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ApiResponse | any> {
    const userForDelete = await this.usersService.getUserDb({ id });
    if (!userForDelete) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        apiResponse({
          status: APIStatus.FAILURE,
          message: `Account doesn't exist`,
          data: null,
        }),
      );
    }
    const rs = await this.usersService.deleteUserDb(id);
    if (rs) {
      return res.status(HttpStatus.OK).json(
        apiResponse({
          status: APIStatus.SUCCESS,
          message: 'Delete user success',
          data: null,
        }),
      );
    }

    throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
