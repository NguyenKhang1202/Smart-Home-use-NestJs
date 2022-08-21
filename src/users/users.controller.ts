import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { Roles } from 'src/security/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/security/guard/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
@ApiBearerAuth()
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiTags('users')
// @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'Create account success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Get list of users success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 200, description: 'Get user success!' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneByField({ where: { id: +id } });
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 204, description: 'Update user success!' })
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(200)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(+id, updateUserDto); // dấu + để ép string thành number
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'Delete user success!' })
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.usersService.remove(+id);
  }
}
