import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './security/guard/jwt-auth.guard';
import { Roles } from './security/decorators/roles.decorators';
import { Role } from './users/entities/role.enum';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('App')
@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Test function get success!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'test' })
  @Get('/app/protected')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  getHello(@Req() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }
}
