import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './entities/home.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home) private readonly homeRepository: Repository<Home>,
  ) {}
  async create(createHomeDto: CreateHomeDto) {
    return await this.homeRepository.save(createHomeDto);
  }

  async findAll() {
    return await this.homeRepository.find({});
  }

  async findOne(id: number) {
    return await this.homeRepository.findOneBy({ id });
  }

  async update(id: number, updateHomeDto: UpdateHomeDto) {
    return await this.homeRepository.update(id, updateHomeDto);
  }

  async remove(id: number) {
    return await this.homeRepository.delete(id);
  }
}
