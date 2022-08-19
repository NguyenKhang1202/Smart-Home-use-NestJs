import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}
  async create(createHouseDto: CreateHouseDto) {
    const result = await this.houseRepository.create(createHouseDto);
    // if (!result) throw new Exception('Create house failed');
  }

  findAll() {
    return `This action returns all house`;
  }

  findOne(id: number) {
    return `This action returns a #${id} house`;
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }

  remove(id: number) {
    return `This action removes a #${id} house`;
  }
}
