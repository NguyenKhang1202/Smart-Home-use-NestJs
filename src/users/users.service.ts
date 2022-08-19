import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      // eslint-disable-next-line prefer-const
      let userFind: User = await this.findOneByField({
        where: {
          username: createUserDto.username,
        },
      });
      if (userFind) {
        throw new HttpException(
          'Login name already used!',
          HttpStatus.BAD_REQUEST,
        );
      }
      userFind = await this.findOneByField({
        where: { email: createUserDto.email },
      });
      if (userFind) {
        throw new HttpException('Email already used!', HttpStatus.BAD_REQUEST);
      }
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const user: User = await this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      const result: UserDto = await this.userRepository.save(user);
      return result;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({});
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByField(
    options: FindOneOptions<User>,
  ): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne(options);
      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userRepository.update(id, updateUserDto);
      if (result.affected == 1) {
        return {
          status: '204',
          message: 'Update successful',
        };
      }
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
