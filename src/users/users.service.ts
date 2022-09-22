import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
const logger: Logger = new Logger('users.services.ts');
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // get all users
  async getAllUserDb(query: any): Promise<User[] | undefined> {
    try {
      const user: User[] = await this.userRepository.findBy(query);
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
