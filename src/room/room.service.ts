import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
const logger: Logger = new Logger('room.services.ts');

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  // get all rooms
  async getAllRoomsDb(): Promise<Room[] | undefined> {
    try {
      const rooms: Room[] = await this.roomRepository.findBy({});
      return rooms;
    } catch (error) {
      logger.error('getAllRoomsDb: ' + error);
    }
  }

  // get one room
  async getRoomDb(query: any): Promise<Room | undefined> {
    try {
      const room: Room = await this.roomRepository.findOneBy(query);
      return room;
    } catch (error) {
      logger.error('getRoomDb: ' + error);
    }
  }

  async createRoomDb(
    userId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<Room | undefined> {
    try {
      const rs: Room = await this.roomRepository.save({
        userId,
        ...createRoomDto,
      });
      return rs;
    } catch (error) {
      logger.error('createRoomDb: ' + error);
    }
  }

  async updateRoomDb(
    roomForEdit: Room,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room | undefined> {
    try {
      roomForEdit.roomName = updateRoomDto.roomName;
      const rs: Room = await this.roomRepository.save(roomForEdit);
      return rs;
    } catch (error) {
      logger.error('updateRoomDb: ' + error);
    }
  }

  async deleteRoomDb(id: string): Promise<DeleteResult | undefined> {
    try {
      const result: DeleteResult = await this.roomRepository.delete(id);
      if (result.affected == 1) return result;
    } catch (error) {
      logger.error('deleteUserDb: ' + error);
    }
  }
}
