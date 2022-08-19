import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createHouseDto: CreateHouseDto) {
    return await this.houseService.create(createHouseDto);
  }

  @Get()
  findAll() {
    return this.houseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.houseService.update(+id, updateHouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.houseService.remove(+id);
  }
}
