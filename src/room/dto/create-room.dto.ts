import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  roomName: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
