import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto, LoginRequestDto } from 'src/auth/dto/auth.dto';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeleteResult,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
const logger: Logger = new Logger('users.services.ts');
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // get all users
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  async getAllUserDb(query: Object): Promise<User[] | undefined> {
    try {
      const user: User[] = await this.userRepository.findBy({});
      return user;
    } catch (error) {
      logger.error('getAllUserDb: ' + error);
    }
  }

  // get one user
  async getUserDb(query: FindOptionsWhere<User>): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneBy(query);
      return;
    } catch (error) {
      logger.error('getUserDb: ' + error);
    }
  }

  // insert new user
  async createUserDb(createUserDto: CreateUserDto): Promise<User | undefined> {
    try {
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const userCreate: CreateUserDto = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      const user: User = await this.userRepository.save(userCreate);
      return user;
    } catch (error) {
      logger.error('createUserDb: ' + error);
    }
  }

  // update user info
  async updateUserDb(updateUserDto: UpdateUserDto, userForEdit: User) {
    try {
      userForEdit.email = updateUserDto.email;
      userForEdit.fullName = updateUserDto.fullName;
      userForEdit.role = updateUserDto.role;
      userForEdit.age = updateUserDto.age;

      const result: User = await this.userRepository.save(userForEdit);
      return result;
    } catch (error) {
      logger.error('updateUserDb: ' + error);
    }
  }

  async changePasswordDb(user: User, newPassword: string) {
    user.password = newPassword;
    const rs: User = await this.userRepository.save(user);
    return rs;
  }

  async deleteUserDb(id: string): Promise<DeleteResult> {
    try {
      const result: DeleteResult = await this.userRepository.delete(id);
      if (result.affected == 1) return result;
    } catch (error) {
      logger.error('deleteUserDb: ' + error);
    }
  }
}
