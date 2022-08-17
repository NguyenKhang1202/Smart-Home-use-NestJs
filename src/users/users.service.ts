import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    try {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      const result = this.userRepository.save(user);
      return result;
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<CreateUserDto[]> {
    return await this.userRepository.find({});
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username: username });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  // async validate(body: LoginDto) {
  //   try {
  //     const user = await this.userRepository.findOne({
  //       where: { username: body.username },
  //     });
  //     if (!user)
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.FORBIDDEN,
  //           error: 'This is a custom message',
  //         },
  //         HttpStatus.FORBIDDEN,
  //       );
  //     const isMatch = await bcrypt.compare(body.password, user.password);
  //     if (!isMatch)
  //       throw new HttpException(
  //         'Incorrect email or password',
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //     return user;
  //   } catch (error) {
  //     throw new HttpException('Server error', HttpStatus.BAD_REQUEST);
  //   }
  // }
}
