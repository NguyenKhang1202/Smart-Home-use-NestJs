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
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './decorators/roles.decorators';
import { Role } from './users/entities/role.enum';
@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get('/protected')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  getHello(@Request() req): string {
    console.log(req.user);
    return this.appService.getHello();
  }
}
