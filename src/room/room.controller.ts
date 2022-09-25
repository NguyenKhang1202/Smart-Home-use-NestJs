import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  Req,
  Put,
  Logger,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { APIStatus } from 'src/config/constants';
import { Auth } from 'src/security/decorators/auth.decorator';
import { Role } from 'src/users/entities/role.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Room } from './entities/room.entity';
const logger: Logger = new Logger('room.controller.ts');

@ApiTags('rooms')
// @Auth(Role.USER)
@Controller('/api/v1/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Get list of rooms success!' })
  @Get()
  async getAllRooms(): Promise<APIResponse<Room[]> | undefined> {
    const rooms: Room[] = await this.roomService.getAllRoomsDb();
    if (rooms) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get list of rooms successfully',
        data: rooms,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Get one room' })
  @ApiResponse({ status: 200, description: 'Get room success!' })
  @Get(':id')
  @HttpCode(200)
  async getRoom(
    @Param('id') id: string,
  ): Promise<APIResponse<Room> | undefined> {
    const room: Room | any = await this.checkRoomId(id);
    if (room) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Get room success',
        data: room,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({ status: 201, description: 'Create room success!' })
  @Post()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: Request | any,
  ): Promise<APIResponse<Room> | undefined> {
    const isRoomNameExist: Room = await this.roomService.getRoomDb({
      roomName: createRoomDto.roomName,
    });
    if (isRoomNameExist) {
      throw new HttpException(
        {
          status: APIStatus.FAILURE,
          message: 'Room is already exist',
        },
        HttpStatus.CONFLICT,
      );
    }
    const userId = req?.user?.id;
    const room = await this.roomService.createRoomDb(userId, createRoomDto);
    if (room) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Create room successfully',
        data: room,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: 200, description: 'Update room success!' })
  @Put(':id')
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<APIResponse<Room> | undefined> {
    const roomForEdit: Room = await this.checkRoomId(id);
    const rs: Room | undefined = await this.roomService.updateRoomDb(
      roomForEdit,
      updateRoomDto,
    );
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Update room successfully',
        data: rs,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: 200, description: 'Delete room success!' })
  @Delete(':id')
  async deleteRoom(
    @Param('id') id: string,
  ): Promise<APIResponse<null> | undefined> {
    await this.checkRoomId(id);

    const rs = await this.roomService.deleteRoomDb(id);
    if (rs) {
      return {
        status: APIStatus.SUCCESS,
        message: 'Delete room success',
        data: null,
      };
    }

    throw new HttpException(
      {
        status: APIStatus.ERROR,
        message: 'Server error!',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async checkRoomId(roomId: string): Promise<Room | any> {
    try {
      const rs: Room = await this.roomService.getRoomDb({ id: roomId });
      if (rs) return rs;
      else {
        throw new HttpException(
          {
            status: APIStatus.ERROR,
            message: `Incorrect room id or you don't have this room`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      logger.error('checkRoomId: ' + error);
    }
  }
}
